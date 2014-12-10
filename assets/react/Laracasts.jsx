var Lesson = React.createClass({
    watchLesson: function (e) {
        e.preventDefault();

        this.props.watchLesson();
    },
    render: function () {
        return (
            <div className="laracasts-lesson">
                <p>
                    <small>
                        <b>
                            <i className="fa fa-fw fa-clock-o"></i> {this.props.date}</b>
                    </small>
                    <button onClick={this.props.removeLesson} type="button" className="close" data-dismiss="alert">
                        <span aria-hidden="true">&times;</span>
                        <span className="sr-only">Close</span>
                    </button>
                </p>
                <h4>
                    <i onClick={this.props.toggleWatched} className={this.props.watched ? 'fa fa-fw fa-check-square-o' : 'fa fa-fw fa-square-o'}></i>
                    <a onClick={this.watchLesson} target="_blank" href={this.props.href}>{this.props.heading}</a>
                </h4>
                <p>{this.props.text}</p>
                <br />
            </div>
        );

    }
});

var Lessons = React.createClass({
    render: function () {
        var that = this;
        var lessonNodes = this.props.lessons.map(function (lesson, key) {
            return (
                <Lesson item={lesson} watchLesson={that.props.watchLesson.bind(this, key)} removeLesson={that.props.removeLesson.bind(this, key)} watched={lesson.watched} toggleWatched={that.props.toggleWatched.bind(this, key)} date={lesson.date} heading={lesson.title} text={lesson.summary} href={lesson.link} />
            );
        });
        return (
            <div>
                {lessonNodes}
            </div>

        );
    }
});

var Navbar = React.createClass({
    render: function () {
        return (
            <nav className="navbar navbar-default" role="navigation">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span className="sr-only">Toggle navigation</span>
                            <i className="fa fa-fw fa-cogs"></i>
                        </button>
                        <a target="_blank" className="navbar-brand" href="https://laracasts.com">Laracasts
                            <i> Notifier</i>
                        </a>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li>
                                <a onClick={this.props.markAllWatched} href="#">
                                    <i className="fa fa-fw fa-eye"></i>
                                    Mark All Watched</a>
                            </li>
                            <li>
                                <a onClick={this.props.refreshFeed} href="#">
                                    <i className="fa fa-fw fa-refresh"></i>
                                    Refresh Feed</a>
                            </li>

                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                    <i className="fa fa-fw fa-info"></i>
                                    About
                                    <span className="caret"></span>
                                </a>
                                <ul className="dropdown-menu" role="menu">
                                    <li>
                                        <a target="_blank" href="https://github.com/mabasic/laracasts-chrome-extension/issues">
                                            <i className="fa fa-fw fa-bug"></i>
                                            Report an Issue</a>
                                    </li>
                                    <li>
                                        <a target="_blank" href="https://github.com/mabasic/laracasts-chrome-extension">
                                            <i className="fa fa-fw fa-github"></i>
                                            View on GitHub</a>
                                    </li>

                                    <li>
                                        <a target="_blank" href="https://gratipay.com/mabasic/">
                                            <i className="fa fa-fw fa-usd"></i>
                                            Donate Developer</a>
                                    </li>

                                    <li>
                                        <a target="_blank" href="http://mariobasic.com">
                                            <i className="fa fa-fw fa-heart-o"></i>
                                            Developer Blog</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});

var Notifier = React.createClass({
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
                // Success
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
    watchLesson: function(key) {

        var that = this;

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

    },
    render: function () {
        return (
            <div>
                <Navbar markAllWatched={this.markAllWatched} lessons={this.state.lessons} refreshFeed={this.refreshFeed} />

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <Lessons lessons={this.state.lessons} watchLesson={this.watchLesson} toggleWatched={this.toggleWatched} removeLesson={this.removeLesson} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

React.render(
    <Notifier url="http://laracasts-feed.mariobasic.app/api/v1/feed/lessons" pollInterval={2000} />,
    document.getElementById('notifier')
);
