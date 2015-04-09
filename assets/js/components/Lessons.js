import React from 'react';

import Lesson from './Lesson.js';

class Lessons extends React.Component {

    render() {

        var that = this;

        var lessonNodes = this.props.lessons.map((lesson, key) => {
            return (
                <Lesson key={key} item={lesson} watchLesson={that.props.watchLesson.bind(this, key)} removeLesson={that.props.removeLesson.bind(this, key)} watched={lesson.watched} toggleWatched={that.props.toggleWatched.bind(this, key)} date={lesson.date} heading={lesson.title} text={lesson.summary} href={lesson.link} />
            );
        });

        return (
            <div>
                {lessonNodes}
            </div>
        );

    }

}

export default Lessons;