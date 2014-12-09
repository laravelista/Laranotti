var Lesson = React.createClass({
    render: function () {
        return (
            <div className="laracasts-lesson">
                <p><small><b><i className="fa fa-fw fa-clock-o"></i> {this.props.date}</b></small></p>
                <h4><i onClick={this.props.toggleWatched} className={this.props.watched ? 'fa fa-fw fa-check-square-o' : 'fa fa-fw fa-square-o'}></i> <a target="_blank" href={this.props.href}>{this.props.heading}</a></h4>
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
                <Lesson item={lesson} watched={lesson.watched} toggleWatched={that.props.toggleWatched.bind(this, key)} date={lesson.date} heading={lesson.title} text={lesson.summary} href={lesson.link} />
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
                        <a target="_blank" className="navbar-brand" href="https://laracasts.com">Laracasts</a>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li><a onClick={this.props.markAllWatched} href="#"><i className="fa fa-fw fa-eye"></i> Mark All Watched</a></li>
                            <li><a onClick={this.props.refreshFeed} href="#"><i className="fa fa-fw fa-refresh"></i> Refresh Feed</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});

var Notifier = React.createClass({
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
            <div>
                <Navbar markAllWatched={this.markAllWatched} lessons={this.state.lessons} refreshFeed={this.refreshFeed} />

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <Lessons lessons={this.state.lessons} toggleWatched={this.toggleWatched} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

React.render(
    <Notifier url="http://laracasts-feed.mariobasic.app/api/v1/feed/lessons" pollInterval={10000} />,
    document.getElementById('notifier')
);