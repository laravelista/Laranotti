import React from 'react';
import $ from 'jquery';

import Navbar from './Navbar.js';
import Lessons from './Lessons.js';
import Chrome from '../Chrome.js';

class Notifier extends React.Component {

    /**
     * Default value is empty array.
     *
     * @type {{lessons: Array}}
     */
    state = {lessons: []};

    /**
     * Run once the components is mounted.
     */
    componentDidMount() {
        var lessons = this.props.laranotti.lessons;

        if (lessons != []) {
            this.setState({lessons: lessons});
        }

        this._refreshFeed();

        this.attachListeners();
    }

    /**
     * Add listeners to this method.
     * When the component mounts, the listeners
     * are attached.
     */
    attachListeners() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action == 'updateState') {
                this.fetchLessonsFromStorage();
            }
        });
    }

    /**
     * Triggers Laranotti to fetch lessons from Storage
     * and then updates state lessons to lessons fetched.
     */
    fetchLessonsFromStorage() {
        this.props.laranotti.getLessonsFromStorage();

        this.setState({lessons: this.props.laranotti.lessons});
    }

    /**
     * Triggers Laranotti to check for new lessons on Laracasts.
     * Once done, it updates the state lessons.
     *
     * @private
     */
    _refreshFeed() {
        this.props.laranotti.checkForNewLessons().done(Laranotti => {
            this.setState({lessons: this.props.laranotti.lessons});
        });
    }

    /**
     * Marks all lessons watched on Laranotti
     * and updates state.
     *
     * @private
     */
    _markAllWatched() {
        this.props.laranotti.markAllLessonsWatched();

        this.setState({lessons: this.props.laranotti.lessons});
    }

    /**
     * Toggles a lesson as watched or unwatched on Laranotti
     * and update the state lessons.
     *
     * @param key
     * @private
     */
    _toggleWatched(key) {
        this.props.laranotti.toggleLessonWatched(key);

        this.setState({lessons: this.props.laranotti.lessons});
    }

    /**
     * Removes a single lessons from Laranotti lessons
     * and updates the state lessons.
     *
     * @param key
     * @private
     */
    _removeLesson(key) {
        this.props.laranotti.removeLesson(key);

        this.setState({lessons: this.props.laranotti.lessons});
    }

    /**
     * If the user clicks on a lesson title then
     * that lesson is opened in a new tab. Once
     * that tab closes, it marks that lessons watched.
     *
     * @param key
     * @returns {boolean}
     * @private
     */
    _watchLesson(key) {
        if (! Chrome.supportsChromeTabs()) return false;

        chrome.tabs.create({
            url: this.state.lessons[key].link
        }, tab => {

            chrome.runtime.sendMessage({
                action: 'detectLessonTabClosed',
                tabId: tab.id,
                lessonId: key
            });

        });
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