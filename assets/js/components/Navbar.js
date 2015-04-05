import React from 'react';

class Navbar extends React.Component{

    render() {

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

}

export default Navbar;