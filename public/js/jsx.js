var Lesson = React.createClass({displayName: 'Lesson',
    render: function () {
        
        console.log(this.props.watched);

        if(this.props.watched == false) {
            return (
                React.createElement("div", {className: "laracasts-lesson"}, 
                    React.createElement("p", null, React.createElement("small", null, React.createElement("b", null, React.createElement("i", {className: "fa fa-fw fa-clock-o"}), " ", this.props.date))), 
                    React.createElement("h4", null, React.createElement("i", {onClick: this.props.toggleWatched, className: "fa fa-fw fa-square-o"}), " ", React.createElement("a", {target: "_blank", href: this.props.href}, this.props.heading)), 
                    React.createElement("p", null, this.props.text), 
                    React.createElement("br", null)
                )
            );
        }

        return (
            React.createElement("div", {className: "laracasts-lesson"}, 
                React.createElement("p", null, React.createElement("small", null, React.createElement("b", null, React.createElement("i", {className: "fa fa-fw fa-clock-o"}), " ", this.props.date))), 
                React.createElement("h4", null, React.createElement("i", {onClick: this.props.toggleWatched, className: "fa fa-fw fa-check-square-o"}), " ", React.createElement("a", {target: "_blank", href: this.props.href}, this.props.heading)), 
                React.createElement("p", null, this.props.text), 
                React.createElement("br", null)
            )
        );

    }
});

var Lessons = React.createClass({displayName: 'Lessons',
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
                React.createElement(Lesson, {item: item, watched: item.watched, toggleWatched: that.toggleWatched, date: item.date, heading: item.title, text: item.summary, href: item.link})
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
    markAllWatched: function (e) {
        e.preventDefault();
        console.log('All marked as watched!');
    },
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
                            React.createElement("li", null, React.createElement("a", {onClick: this.markAllWatched, href: "#"}, React.createElement("i", {className: "fa fa-fw fa-eye"}), " Mark All Watched")), 
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
            React.createElement("div", null, 
                React.createElement(Navbar, {lessons: this.state.data, refreshFeed: this.refreshFeed}), 

                React.createElement("div", {className: "container-fluid"}, 
                    React.createElement("div", {className: "row"}, 
                        React.createElement("div", {className: "col-md-12"}, 
                            React.createElement(Lessons, {data: this.state.data})
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
/*
var NotifierItem = React.createClass({
    render: function () {
        return (
            <div className="laracasts-lesson">
                <p><small><b><i className="fa fa-fw fa-clock-o"></i> {this.props.date}</b></small></p>
                <h4><i className="fa fa-fw fa-square-o"></i> <a target="_blank" href={this.props.href}>{this.props.heading}</a></h4>
                <p>{this.props.text}</p>
                <br />
            </div>
        );
    }
});

var Notifier = React.createClass({
	getInitialState: function () {
        return {data: []};
    },
    componentDidMount: function () {
        this.fetchFeedFromLaracasts();
        //setInterval(this.fetchFeedFromLaracasts, this.props.pollInterval);
        //this.setState({data: this.props.data});
    },
    fetchFeedFromLaracasts: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function (data) {
                this.setState({data: data});
                */
/*console.log(data.length.toString());*//*

                chrome.browserAction.setBadgeText({text: data.length.toString()});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {

    	var notifierNodes = this.state.data.map(function (item) {
            return (
                <NotifierItem date={item.date} heading={item.title} text={item.summary} href={item.link} />
            );
        });
        return (
            <div>
                {notifierNodes}
            </div>

        );
    }
});

var data = [
  {
  	heading: "How to Build Command-Line Apps",
  	text: "In this series, we'll learn how how to build command-line apps from scratch, using Symfony's excellent console component. In no time, you'll be whipping up executables to perform all sorts of tasks.",
  	link: "https://laracasts.com/series/how-to-build-command-line-apps-in-php"
  },
  {
  	heading: "Case Study: The Laravel Installer",
  	text: "To continue our learning, let's review the makeup of Laravel's command-line installer tool. In fact, we'll reproduce it from scratch!",
  	link: "https://laracasts.com/series/how-to-build-command-line-apps-in-php/episodes/4"
  },
  {
  	heading: "Laravel and the Front-end",
  	text: "Let's take a break from the back-end, and instead focus on that other world: the front-end! Don't worry, Laravel 5 has made this process as enjoyable as it can be. We'll review everything from Bower to Laravel Elixir.",
  	link: "https://laracasts.com/series/laravel-5-and-the-front-end"
  },
  {
  	heading: "Elixir TDD",
  	text: "We can also use Elixir to assist with test-driven development. Let me show you what I mean!",
  	link: "https://laracasts.com/series/laravel-5-and-the-front-end/episodes/5"
  },
  {
  	heading: "Elixir Asset Concatenation",
  	text: "To save on countless HTTP requests, you'll often want to merge, or concatenate, any number of stylesheets or scripts. Let me show you how to do this, using Laravel Elixir.",
  	link: "https://laracasts.com/series/laravel-5-and-the-front-end/episodes/4"
  }
];

// React.render(
// 	<Notifier url="https://laracasts.com/feed" data={data} pollInterval={10000} />,
// 	document.getElementById('notifier')
// );

// Local development
React.render(
	<Notifier url="http://laracasts-feed.mariobasic.app/api/v1/feed/lessons" data={data} pollInterval={2000} />,
	document.getElementById('notifier')
);

// Production development
// React.render(
// 	<Notifier url="http://laracasts-feed.mariobasic.com/api/v1/feed" data={data} pollInterval={10000} />,
// 	document.getElementById('notifier')
// );*/
