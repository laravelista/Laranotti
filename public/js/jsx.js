var Lesson = React.createClass({displayName: 'Lesson',
    render: function () {
        return (
            React.createElement("div", {className: "laracasts-lesson"}, 
                React.createElement("p", null, React.createElement("small", null, React.createElement("b", null, React.createElement("i", {className: "fa fa-fw fa-clock-o"}), " ", this.props.date))), 
                React.createElement("h4", null, React.createElement("i", {onClick: this.props.toggleWatched, className: this.props.watched ? 'fa fa-fw fa-check-square-o' : 'fa fa-fw fa-square-o'}), " ", React.createElement("a", {target: "_blank", href: this.props.href}, this.props.heading)), 
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
                React.createElement(Lesson, {item: lesson, watched: lesson.watched, toggleWatched: that.props.toggleWatched.bind(this, key), date: lesson.date, heading: lesson.title, text: lesson.summary, href: lesson.link})
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
                        React.createElement("a", {target: "_blank", className: "navbar-brand", href: "https://laracasts.com"}, "Laracasts")
                    ), 
                    React.createElement("div", {className: "collapse navbar-collapse", id: "bs-example-navbar-collapse-1"}, 
                        React.createElement("ul", {className: "nav navbar-nav"}, 
                            React.createElement("li", null, React.createElement("a", {onClick: this.props.markAllWatched, href: "#"}, React.createElement("i", {className: "fa fa-fw fa-eye"}), " Mark All Watched")), 
                            React.createElement("li", null, React.createElement("a", {onClick: this.props.refreshFeed, href: "#"}, React.createElement("i", {className: "fa fa-fw fa-refresh"}), " Refresh Feed"))
                        )
                    )
                )
            )
        );
    }
});

var Notifier = React.createClass({displayName: 'Notifier',
    getInitialState: function () {

        if(typeof chrome.storage === 'object') {
            var that = this;

            // This is loaded when it loads
            chrome.storage.sync.get('lessons', function (result) {
                that.setState({lessons : result.lessons});
            });
        }

        return {lessons: []};
    },
    prepareLessons: function (lessons) {
        lessons.map(function (lesson) {
            lesson.watched = false;
        });

        return lessons;
    },
    componentDidMount: function () {
        //this.fetchFeedFromLaracasts();
        //setInterval(this.fetchFeedFromLaracasts, this.props.pollInterval);
        //this.setState({lessons: this.props.lessons});
    },
    fetchFeedFromLaracasts: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function (data) {

                this.setState({lessons: this.prepareLessons(data)});

                this.updateBadge();

                this.storeLessons();

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    storeLessons: function () {
        if(typeof chrome.storage === 'object') {
            chrome.storage.sync.set({'lessons': this.state.lessons}, function() {
                console.log('Lessons saved');
            });
        }
    },
    refreshFeed: function (e) {
        e.preventDefault();

        console.log('Refreshing feed');

        this.fetchFeedFromLaracasts();
    },
    updateBadge: function () {

        // Count number of unwatched lessons from state
        var numberOfUnwatchedLessons = this.state.lessons.filter(function (lesson) {
            return lesson.watched == false;
        }).length;

        if(typeof chrome.browserAction === 'object')
        {
            chrome.browserAction.setBadgeText({text: numberOfUnwatchedLessons.toString()});
        }

    },
    markAllWatched: function (e) {
        e.preventDefault();

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

        lessons[key].watched =lessons[key].watched == false;

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
                            React.createElement(Lessons, {lessons: this.state.lessons, toggleWatched: this.toggleWatched})
                        )
                    )
                )
            )
        );
    }
});

React.render(
    React.createElement(Notifier, {url: "http://laracasts-feed.mariobasic.app/api/v1/feed/lessons", pollInterval: 10000}),
    document.getElementById('notifier')
);