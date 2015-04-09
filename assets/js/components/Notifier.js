import React from 'react';
import $ from 'jquery';

import Navbar from './Navbar.js';
import Lessons from './Lessons.js';

class Notifier extends React.Component {

    state = { lessons: [] };

    componentDidMount() {
        var lessons = this.props.laranotti.lessons;

        if(lessons != []) {
            this.setState({lessons: lessons});
        }

        this._refreshFeed();
    }

    _refreshFeed() {
        var that = this;
        this.props.laranotti.checkForNewLessons().done(Laranotti => {
            that.setState({lessons: that.props.laranotti.lessons});
        });
    }

    _markAllWatched() {
        this.props.laranotti.markAllLessonsWatched();

        this.setState({lessons: this.props.laranotti.lessons});
    }

    _toggleWatched(key) {
        this.props.laranotti.toggleLessonWatched(key);

        this.setState({lessons: this.props.laranotti.lessons});
    }

    _removeLesson(key) {
        this.props.laranotti.removeLesson(key);

        this.setState({lessons: this.props.laranotti.lessons});
    }

    _watchLesson(key) {

        if (typeof chrome.tabs === 'object') {

            chrome.tabs.create({
                url: this.state.lessons[key].link
            }, tab => {

                chrome.runtime.sendMessage({tabId: tab.id, lessonId: key}, response => {
                    //console.log(response.farewell);
                    //that.toggleWatched(key);
                    // or even better fetch feed ???
                    // TODO: this is unnecessary maybe ?
                });

            });

        }

    }

    render() {
        return (
            <div>
                <Navbar markAllWatched={this._markAllWatched.bind(this)} lessons={this.state.lessons} refreshFeed={this._refreshFeed.bind(this)} />

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <Lessons lessons={this.state.lessons} watchLesson={this._watchLesson.bind(this)} toggleWatched={this._toggleWatched.bind(this)} removeLesson={this._removeLesson.bind(this)} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Notifier;