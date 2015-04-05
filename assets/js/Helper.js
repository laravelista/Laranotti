import $ from 'jquery';

import Chrome from './Chrome.js';

class Helper {

    /**
     * Converts string (14.4.2015) to Date class.
     *
     * @param string
     * @returns {Date}
     */
    static convertToDate(string) {
        var parts = string.split('.');
        return new Date(parts[2], parts[1], parts[0]);
    }

    /**
     * Sorts lessons by date descending.
     * From newest to oldest.
     *
     * @param lessons
     * @returns {*}
     */
    static sortLessonsByDate(lessons) {
        lessons.sort(function (a, b) {
            a = Helper.convertToDate(a.date);
            b = Helper.convertToDate(b.date);
            return b > a;
        });

        return lessons;
    }

    /**
     * Returns the position of lesson if found.
     *
     * @param title
     * @param lessons
     * @returns {number}
     */
    static searchForLessonByTitle(title, lessons) {
        for(var i = 0; i < lessons.length; i++) {
            if(title == lessons[i].title) {
                return i;
            }
        }
    }

    /**
     * Adds watched property and sets it to false by default.
     *
     * @param lessons
     * @returns {*}
     */
    static prepareLessons(lessons) {
        return lessons.map(function (lesson) {
            lesson['watched'] = false;
            return lesson;
        });
    }


    /**
     * It compares lessons with feed and returns
     * @param lessons
     * @param feed
     * @returns {*}
     */
    static getNewLessonsByComparison(lessons, feed) {
        return feed.filter(function (item) {
            for (var i = 0; i < lessons.length; i++) {
                if (item.title == lessons[i].title) {
                    return false;
                }
            }

            // Adds item to the beginning of lessons array
            //lessons.unshift(item);

            return true;
        });
    }

    /**
     * Adds new lessons to lessons array and returns it.
     *
     * @param newLessons
     * @param lessons
     * @returns {*}
     */
    static addNewLessonsToLessons(newLessons, lessons) {
        newLessons.forEach(function (lesson) {
            lessons.unshift(lesson);
        });

        return lessons;
    }

    /**
     * Creates a notification based on the amount of new lessons.
     *
     * @param newLessons
     * @param lessons
     */
    static createNotifications(newLessons, lessons) {

        // If there is only 1 new lesson, create a basic notification.
        if (newLessons.length == 1) {

            var id = Helper.searchForLessonByTitle(newLessons[0].title, lessons);

            Chrome.createBasicNotificationForLesson(id.toString(), newLessons[0].title, newLessons[0].summary);
        }

        // If there are more than 1 new lessons, create a list notification.
        if (newLessons.length > 1) {

            var items = [];

            newLessons.forEach(function (lesson) {
                items.push({title: lesson.title, message: lesson.summary});
            });

            Chrome.createListNotificationForLessons(newLessons.length.toString() + ' New Lessons on Laracasts.', 'You have ' + newLessons.length.toString() + 'lessons unwatched.', items);
        }

    }

}

export default Helper;