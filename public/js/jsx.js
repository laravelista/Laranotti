var Lesson = React.createClass({displayName: 'Lesson',
    render: function () {
        return (
            React.createElement("div", {className: "laracasts-lesson"}, 
                React.createElement("p", null, 
                    React.createElement("small", null, 
                        React.createElement("b", null, 
                            React.createElement("i", {className: "fa fa-fw fa-clock-o"}), " ", this.props.date)
                    ), 
                    React.createElement("button", {onClick: this.props.removeLesson, type: "button", className: "close", 'data-dismiss': "alert"}, 
                        React.createElement("span", {'aria-hidden': "true"}, "×"), 
                        React.createElement("span", {className: "sr-only"}, "Close")
                    )
                ), 
                React.createElement("h4", null, 
                    React.createElement("i", {onClick: this.props.toggleWatched, className: this.props.watched ? 'fa fa-fw fa-check-square-o' : 'fa fa-fw fa-square-o'}), 
                    React.createElement("a", {target: "_blank", href: this.props.href}, this.props.heading)
                ), 
                React.createElement("p", null, this.props.text), 
                React.createElement("br", null)
            )
        );

    }
});

var Lessons = React.createClass({displayName: 'Lessons',
    render: function () {
        var that = this;
        var lessonNodes = this.props.lessons.map(function (lesson, key) {
            return (
                React.createElement(Lesson, {item: lesson, removeLesson: that.props.removeLesson.bind(this, key), watched: lesson.watched, toggleWatched: that.props.toggleWatched.bind(this, key), date: lesson.date, heading: lesson.title, text: lesson.summary, href: lesson.link})
            );
        });
        return (
            React.createElement("div", null, 
                lessonNodes
            )

        );
    }
});

var Navbar = React.createClass({displayName: 'Navbar',
    render: function () {
        return (
            React.createElement("nav", {className: "navbar navbar-default", role: "navigation"}, 
                React.createElement("div", {className: "container-fluid"}, 
                    React.createElement("div", {className: "navbar-header"}, 
                        React.createElement("button", {type: "button", className: "navbar-toggle collapsed", 'data-toggle': "collapse", 'data-target': "#bs-example-navbar-collapse-1"}, 
                            React.createElement("span", {className: "sr-only"}, "Toggle navigation"), 
                            React.createElement("i", {className: "fa fa-fw fa-cogs"})
                        ), 
                        React.createElement("a", {target: "_blank", className: "navbar-brand", href: "https://laracasts.com"}, "Laracasts", 
                            React.createElement("i", null, "Notifier")
                        )
                    ), 
                    React.createElement("div", {className: "collapse navbar-collapse", id: "bs-example-navbar-collapse-1"}, 
                        React.createElement("ul", {className: "nav navbar-nav"}, 
                            React.createElement("li", null, 
                                React.createElement("a", {onClick: this.props.markAllWatched, href: "#"}, 
                                    React.createElement("i", {className: "fa fa-fw fa-eye"}), 
                                    "Mark All Watched")
                            ), 
                            React.createElement("li", null, 
                                React.createElement("a", {onClick: this.props.refreshFeed, href: "#"}, 
                                    React.createElement("i", {className: "fa fa-fw fa-refresh"}), 
                                    "Refresh Feed")
                            ), 

                            React.createElement("li", {className: "dropdown"}, 
                                React.createElement("a", {href: "#", className: "dropdown-toggle", 'data-toggle': "dropdown", role: "button", 'aria-expanded': "false"}, 
                                    React.createElement("i", {className: "fa fa-fw fa-info"}), 
                                    "About", 
                                    React.createElement("span", {className: "caret"})
                                ), 
                                React.createElement("ul", {className: "dropdown-menu", role: "menu"}, 
                                    React.createElement("li", null, 
                                        React.createElement("a", {target: "_blank", href: "https://github.com/mabasic/laracasts-chrome-extension/issues"}, 
                                            React.createElement("i", {className: "fa fa-fw fa-bug"}), 
                                            "Report an Issue")
                                    ), 
                                    React.createElement("li", null, 
                                        React.createElement("a", {target: "_blank", href: "https://github.com/mabasic/laracasts-chrome-extension"}, 
                                            React.createElement("i", {className: "fa fa-fw fa-github"}), 
                                            "View on GitHub")
                                    ), 

                                    React.createElement("li", null, 
                                        React.createElement("a", {target: "_blank", href: "https://gratipay.com/mabasic/"}, 
                                            React.createElement("i", {className: "fa fa-fw fa-usd"}), 
                                            "Donate Developer")
                                    ), 

                                    React.createElement("li", null, 
                                        React.createElement("a", {target: "_blank", href: "http://mariobasic.com"}, 
                                            React.createElement("i", {className: "fa fa-fw fa-heart-o"}), 
                                            "Developer Blog")
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );
    }
});

var Notifier = React.createClass({displayName: 'Notifier',
    getInitialState: function () {
        return {lessons: []};
    },
    prepareLessons: function (lessons) {
        lessons.map(function (lesson) {
            lesson.watched = false;
        });

        return lessons;
    },
    checkForNewLessons: function () {
        this.fetchFeedFromLaracasts();
        //setInterval(this.fetchFeedFromLaracasts, this.props.pollInterval);
    },
    componentDidMount: function () {
        if (typeof chrome.storage === 'object') {
            var that = this;

            // This is loaded when it loads
            chrome.storage.sync.get('lessons', function (result) {

                if(result.lessons === undefined) result.lessons = [];

                that.setState({lessons: result.lessons});

                that.checkForNewLessons();
            });
        }
    },
    searchForLessonByTitle: function (title) {
        for(var i = 0; i < this.state.lessons.length; i++) {
            if(title == this.state.lessons[i].title) {
                return i;
            }
        }
    },
    fetchFeedFromLaracasts: function () {

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
    },
    storeLessons: function () {
        if (typeof chrome.storage === 'object') {
            chrome.storage.sync.set({'lessons': this.state.lessons}, function () {
                console.log('Lessons saved');
            });
        }
    },
    refreshFeed: function (e) {
        e.preventDefault();

        this.fetchFeedFromLaracasts();
    },
    updateBadge: function () {

        // Count number of unwatched lessons from state
        var numberOfUnwatchedLessons = this.state.lessons.filter(function (lesson) {
            return lesson.watched == false;
        }).length;

        if (typeof chrome.browserAction === 'object') {
            chrome.browserAction.setBadgeText({text: numberOfUnwatchedLessons.toString()});
        }

    },
    markAllWatched: function (e) {
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
    },
    toggleWatched: function (key) {
        var lessons = this.state.lessons;

        lessons[key].watched = lessons[key].watched == false;

        this.setState({lessons: lessons});

        this.updateBadge();

        this.storeLessons();
    },
    removeLesson: function (key) {

        var lessons = this.state.lessons;

        lessons.splice(key, 1);

        this.setState({lessons: lessons});

        this.updateBadge();

        this.storeLessons();
    },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement(Navbar, {markAllWatched: this.markAllWatched, lessons: this.state.lessons, refreshFeed: this.refreshFeed}), 

                React.createElement("div", {className: "container-fluid"}, 
                    React.createElement("div", {className: "row"}, 
                        React.createElement("div", {className: "col-md-12"}, 
                            React.createElement(Lessons, {lessons: this.state.lessons, toggleWatched: this.toggleWatched, removeLesson: this.removeLesson})
                        )
                    )
                )
            )
        );
    }
});

React.render(
    React.createElement(Notifier, {url: "http://laracasts-feed.mariobasic.app/api/v1/feed/lessons", pollInterval: 2000}),
    document.getElementById('notifier')
);

