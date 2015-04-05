import React from 'react';

class Lesson extends React.Component {

    watchLesson(e) {
        e.preventDefault();

        this.props.watchLesson();
    }

    render() {

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
                    <a onClick={this.watchLesson.bind(this)} target="_blank" href={this.props.href}>{this.props.heading}</a>
                </h4>
                <p>{this.props.text}</p>
                <br />
            </div>
        );

    }

}

export default Lesson;