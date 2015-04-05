import React from 'react';
import $ from 'jquery';

import Navbar from './Navbar.js';
import Lessons from './Lessons.js';

class Notifier extends React.Component {

    state = { lessons: []};

    prepareLessons(lessons) {
        lessons.map(function (lesson) {
            lesson.watched = false;
        });

        return lessons;
    }

    checkForNewLessons() {
        this.fetchFeedFromLaracasts();
        //setInterval(this.fetchFeedFromLaracasts, this.props.pollInterval);
    }

    componentDidMount() {
        if (typeof chrome.storage === 'object') {
            var that = this;

            // This is loaded when it loads
            chrome.storage.sync.get('lessons', function (result) {

                if(result.lessons === undefined) result.lessons = [];

                that.setState({lessons: result.lessons});

                that.checkForNewLessons();
            });
        }
    }

    searchForLessonByTitle(title) {
        for(var i = 0; i < this.state.lessons.length; i++) {
            if(title == this.state.lessons[i].title) {
                return i;
            }
        }
    }

    fetchFeedFromLaracasts() {

        var that = this;

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function (data) {
                var feed = this.prepareLessons(data);

                var lessons = this.state.lessons;

                var newLessons = feed.filter(function (item) {
                    for (var i = 0; i < that.state.lessons.length; i++) {
                        if (item.title == that.state.lessons[i].title) {
                            return false;
                        }
                    }
                    lessons.unshift(item);

                    return true;
                });

                // Sort by Date
                lessons.sort(function (a, b) {
                    return new Date(b.date) - new Date(a.date);
                });

                this.setState({lessons: lessons});

                if (newLessons.length == 1) {
                    var id = this.searchForLessonByTitle(newLessons[0].title);
                    createBasicNotificationForLesson(id.toString(), newLessons[0].title, newLessons[0].summary);
                }
                else if (newLessons.length > 1) {
                    var items = [];
                    newLessons.forEach(function (lesson) {
                        items.push({title: lesson.title, message: lesson.summary});
                    });
                    createListNotificationForLessons(newLessons.length.toString() + ' New Lessons on Laracasts.', 'You have ' + newLessons.length.toString() + 'lessons unwatched.', items);
                }

                this.updateBadge();

                this.storeLessons();

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    storeLessons() {
        if (typeof chrome.storage === 'object') {
            chrome.storage.sync.set({'lessons': this.state.lessons}, function () {
                // Success
            });
        }
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

        if (typeof chrome.browserAction === 'object') {
            chrome.browserAction.setBadgeText({text: numberOfUnwatchedLessons.toString()});
        }

    }

    markAllWatched(e) {
        if(e !== undefined) {
            e.preventDefault();
        }

        var lessons = this.state.lessons;

        lessons.forEach(function (lesson) {
            lesson.watched = true;
        });

        this.setState({lessons: lessons});

        this.updateBadge();

        this.storeLessons();
    }

    toggleWatched(key) {
        var lessons = this.state.lessons;

        lessons[key].watched = lessons[key].watched == false;

        this.setState({lessons: lessons});

        this.updateBadge();

        this.storeLessons();
    }

    removeLesson(key) {

        var lessons = this.state.lessons;

        lessons.splice(key, 1);

        this.setState({lessons: lessons});

        this.updateBadge();

        this.storeLessons();
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