import React from 'react';
import $ from 'jquery';

import Navbar from './Navbar.js';
import Lessons from './Lessons.js';

import Storage from '../Storage.js';
import Helper from '../Helper.js';
import Chrome from '../Chrome.js';

class Notifier extends React.Component {

    state = { lessons: [] };

    checkForNewLessons() {
        this.fetchFeedFromLaracasts();
    }

    componentDidMount() {
        this.setState({lessons : Storage.getLessons()});

        this.checkForNewLessons();
    }

    fetchFeedFromLaracasts() {

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function (data) {

                var feed = Helper.prepareLessons(data);
                var lessons = this.state.lessons;

                var newLessons = Helper.getNewLessonsByComparison(lessons, feed);

                lessons = Helper.addNewLessonsToLessons(newLessons, lessons);

                lessons = Helper.sortLessonsByDate(lessons);

                this.setState({lessons: lessons});

                Helper.createNotifications(newLessons, lessons);

                this.updateBadge();

                Storage.storeLessons(this.state.lessons);

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    refreshFeed(e) {
        e.preventDefault();

        this.fetchFeedFromLaracasts();
    }

    updateBadge() {

        // Count number of unwatched lessons from state
        var numberOfUnwatchedLessons = this.state.lessons.filter(function (lesson) {
            return lesson.watched == false;
        }).length;

        Chrome.changeBadgeValue(numberOfUnwatchedLessons.toString());
    }

    markAllWatched(e) {

        // What does this do???
        if(e !== undefined) {
            e.preventDefault();
        }

        var lessons = this.state.lessons;

        lessons.forEach(function (lesson) {
            lesson.watched = true;
        });

        this.setState({lessons: lessons});

        this.updateBadge();

        Storage.storeLessons(this.state.lessons);
    }

    toggleWatched(key) {
        var lessons = this.state.lessons;

        lessons[key].watched = lessons[key].watched == false;

        this.setState({lessons: lessons});

        this.updateBadge();

        Storage.storeLessons(this.state.lessons);
    }

    removeLesson(key) {

        var lessons = this.state.lessons;

        lessons.splice(key, 1);

        this.setState({lessons: lessons});

        this.updateBadge();

        Storage.storeLessons(this.state.lessons);
    }

    watchLesson(key) {

        if (typeof chrome.tabs === 'object') {

            chrome.tabs.create({
                url: this.state.lessons[key].link
            }, function (tab) {

                chrome.runtime.sendMessage({tabId: tab.id, lessonId: key}, function(response) {
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
                <Navbar markAllWatched={this.markAllWatched.bind(this)} lessons={this.state.lessons} refreshFeed={this.refreshFeed.bind(this)} />

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <Lessons lessons={this.state.lessons} watchLesson={this.watchLesson.bind(this)} toggleWatched={this.toggleWatched.bind(this)} removeLesson={this.removeLesson.bind(this)} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Notifier;