var Lesson = React.createClass({
    render: function () {
        
        console.log(this.props.watched);

        if(this.props.watched == false) {
            return (
                <div className="laracasts-lesson">
                    <p><small><b><i className="fa fa-fw fa-clock-o"></i> {this.props.date}</b></small></p>
                    <h4><i onClick={this.props.toggleWatched} className="fa fa-fw fa-square-o"></i> <a target="_blank" href={this.props.href}>{this.props.heading}</a></h4>
                    <p>{this.props.text}</p>
                    <br />
                </div>
            );
        }

        return (
            <div className="laracasts-lesson">
                <p><small><b><i className="fa fa-fw fa-clock-o"></i> {this.props.date}</b></small></p>
                <h4><i onClick={this.props.toggleWatched} className="fa fa-fw fa-check-square-o"></i> <a target="_blank" href={this.props.href}>{this.props.heading}</a></h4>
                <p>{this.props.text}</p>
                <br />
            </div>
        );

    }
});

var Lessons = React.createClass({
    toggleWatched: function (e) {
        console.log('mark as watched');

        var icon = $(e.target);

        if(icon.hasClass('fa-square-o')) {
            icon.removeClass('fa-square-o').addClass('fa-check-square-o');
        }
        else {
            icon.removeClass('fa-check-square-o').addClass('fa-square-o');
        }

    },
    render: function () {
        var that = this;
        var lessonNodes = this.props.data.map(function (item) {
            return (
                <Lesson item={item} watched={item.watched} toggleWatched={that.toggleWatched} date={item.date} heading={item.title} text={item.summary} href={item.link} />
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
    markAllWatched: function (e) {
        e.preventDefault();
        console.log('All marked as watched!');
    },
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
                            <li><a onClick={this.markAllWatched} href="#"><i className="fa fa-fw fa-eye"></i> Mark All Watched</a></li>
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
        return {data: []};
    },
    markAllAsNotWatched: function () {
        this.state.data.map(function (lesson) {
            lesson.watched = false;
        });
        console.log(this.state.data);
    },
    componentDidMount: function () {
        this.fetchFeedFromLaracasts();
        //setInterval(this.fetchFeedFromLaracasts, this.props.pollInterval);
        //this.setState({data: this.props.data});
        //this.markAllAsNotWatched();
    },
    fetchFeedFromLaracasts: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            async: false,
            success: function (data) {
                this.setState({data: data});
                /*console.log(data.length.toString());*/
                this.markAllAsNotWatched();
                chrome.browserAction.setBadgeText({text: data.length.toString()});

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    refreshFeed: function (e) {
        e.preventDefault();
        console.log('Refreshing feed');
        this.fetchFeedFromLaracasts();
    },
    render: function () {
        return (
            <div>
                <Navbar lessons={this.state.data} refreshFeed={this.refreshFeed} />

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <Lessons data={this.state.data} />
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