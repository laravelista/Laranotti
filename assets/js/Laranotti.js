import $ from 'jquery';
import Chrome from './Chrome.js';
import Storage from './Storage.js';

class Laranotti {

    lessons = [];

    url = "http://laracasts-feed.mariobasic.com/api/v1/feed/lessons";

    constructor() {
        this.lessons = Storage.getLessons();
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
     * Converts string (14.4.2015) to Date class.
     *
     * @param string
     * @returns {Date}
     */
    static convertToDate(string) {
        var parts = string.split('.');
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }

    /**
     * Sorts lessons by date descending.
     * From newest to oldest.
     *
     * @returns {*}
     */
    sortLessonsByDate() {
        this.lessons.sort(function (a, b) {
            a = Laranotti.convertToDate(a.date);
            b = Laranotti.convertToDate(b.date);
            return b > a;
        });
    }

    /**
     * Returns the position of lesson if found.
     *
     * @param title
     * @returns {number}
     */
    searchForLessonByTitle(title) {
        for(var i = 0; i < this.lessons.length; i++) {
            if(title == this.lessons[i].title) {
                return i;
            }
        }
    }

    /**
     * Creates a notification based on the amount of new lessons.
     *
     * @param newLessons
     */
    createNotifications(newLessons) {

        // If there is only 1 new lesson, create a basic notification.
        if (newLessons.length == 1) {

            var id = this.searchForLessonByTitle(newLessons[0].title);

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

    addNewLessons(data) {
        var feed = Laranotti.prepareLessons(data);

        var newLessons = feed.filter(function (item) {
            for (var i = 0; i < this.lessons.length; i++) {
                if (item.title == this.lessons[i].title) {
                    return false;
                }
            }

            // Adds item to the beginning of lessons array
            this.lessons.unshift(item);

            return true;
        }, this);

        this.sortLessonsByDate();

        this.storeLessonsInStorage();

        return newLessons;
    }

    checkForNewLessons() {

        var deferredObject = $.Deferred();

        $.ajax({
            url: this.url,
            dataType: 'json',
            success: function (data) {

                var newLessons = this.addNewLessons(data);

                this.createNotifications(newLessons);

                this.updateBadge();

                deferredObject.resolve(this);

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());

                deferredObject.resolve(this);
            }.bind(this)
        });

        return deferredObject.promise();
    }

    updateBadge() {
        var numberOfUnwatchedLessons = this.lessons.filter(function (lesson) {
            return lesson.watched == false;
        }).length;

        Chrome.changeBadgeValue(numberOfUnwatchedLessons.toString());
    }

    markAllLessonsWatched() {
        this.lessons.forEach(function (lesson) {
            lesson.watched = true;
        });

        this.storeLessonsInStorage();

        this.updateBadge();
    }

    toggleLessonWatched(key) {
        this.lessons[key].watched = this.lessons[key].watched == false;

        this.storeLessonsInStorage();

        this.updateBadge();
    }

    removeLesson(key) {
        this.lessons.splice(key, 1);

        this.storeLessonsInStorage();

        this.updateBadge();
    }

    storeLessonsInStorage() {
        Storage.storeLessons(this.lessons);
    }

}

export default Laranotti;