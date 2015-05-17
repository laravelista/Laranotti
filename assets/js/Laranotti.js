import $ from 'jquery';
import Chrome from './Chrome.js';
import Storage from './Storage.js';

class Laranotti {

    lessons = [];

    url = "http://lissandra.laravelista.com/api/v1/feed/lessons";

    lessonsToKeep = 20;

    constructor() {
        this.getLessonsFromStorage();
    }

    getLessonsFromStorage() {
        this.lessons = Storage.getLessons();
    }

    /**
     * Adds watched property and sets it to false by default.
     *
     * @param lessons
     * @returns {*}
     */
    static prepareLessons(lessons) {
        return lessons.map(lesson => {
            lesson['watched'] = false;
            lesson['new'] = true;
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
        this.lessons.sort((a, b) => {
            a = Laranotti.convertToDate(a.date);
            b = Laranotti.convertToDate(b.date);
            return b - a;
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

            Chrome.createBasicNotificationForLesson(
                id.toString(),
                newLessons[0].title,
                newLessons[0].summary
            );
        }

        // If there are more than 1 new lessons, create a list notification.
        if (newLessons.length > 1) {

            var items = [];

            newLessons.forEach(lesson => {
                items.push({title: lesson.title, message: lesson.summary});
            });

            Chrome.createListNotificationForLessons(
                newLessons.length.toString() + ' New Lessons on Laracasts.',
                'You have ' + newLessons.length.toString() + 'lessons unwatched.',
                items
            );
        }

    }

    /**
     * Prepares new lessons with correct attributes,
     * checks if the new lessons are already in the current lessons.
     * If the new lesson is not in the current lessons then it
     * adds that new lessons to the beginning of current lessons.
     *  - It sorts the lessons by date once all are added and stores them in storage.
     *
     * @param data
     * @returns {*}
     */
    addNewLessons(data) {
        var feed = Laranotti.prepareLessons(data);

        var newLessons = feed.filter(item => {
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

        this.cleanOldLessons();

        this.storeLessonsInStorage();

        return newLessons;
    }

    /**
     * Uses Ajax to fetch new lessons from my Laracasts feed API.
     * Updates extension badge.
     *
     * @returns {*}
     */
    checkForNewLessons() {

        var deferredObject = $.Deferred();

        $.ajax({
            url: this.url,
            dataType: 'json',
            success: (data) =>  {

                var newLessons = this.addNewLessons(data);

                this.createNotifications(newLessons);

                this.updateBadge();

                deferredObject.resolve(this);

            },
            error: (xhr, status, err) => {

                console.error(this.url, status, err.toString());

                deferredObject.resolve(this);

            }
        });

        return deferredObject.promise();
    }

    /**
     * It updates extension badge with the number of
     * unwatched lessons.
     */
    updateBadge() {
        var numberOfUnwatchedLessons = this.lessons.filter(lesson => {
            return lesson.watched == false;
        }).length;

        Chrome.changeBadgeValue(numberOfUnwatchedLessons.toString());
    }

    /**
     * It marks all lessons watched.
     */
    markAllLessonsWatched() {
        this.lessons.forEach(lesson => {
            lesson.watched = true;
            lesson.new = false;
        });

        this.storeLessonsInStorage();

        this.updateBadge();
    }

    /**
     * It marks only the new lessons as watched and sets
     * the new property to false.
     */
    markNewLessonsWatched() {
        this.lessons.forEach(lesson => {
            if(lesson.new == true) {
                lesson.new = false;
                lesson.watched = true;
            }
        });

        this.storeLessonsInStorage();

        this.updateBadge();
    }

    /**
     * It toggles a lesson watched or unwatched.
     *
     * @param key
     */
    toggleLessonWatched(key) {
        this.lessons[key].watched = this.lessons[key].watched == false;

        this.storeLessonsInStorage();

        this.updateBadge();
    }

    /**
     * It removes a lesson from lessons property by key.
     *
     * @param key
     */
    removeLesson(key) {
        this.lessons.splice(key, 1);

        this.storeLessonsInStorage();

        this.updateBadge();
    }

    /**
     * It stores lessons in storage. (LocalStorage)
     */
    storeLessonsInStorage() {
        Storage.storeLessons(this.lessons);
    }

    /**
     * Because lessons are being stored in localStorage it is best that Laranotti
     * cleans localStorage from watched lessons older that 1 week but only if
     * the maximum number of lessons exceeds ~20 lessons.
     */
    cleanOldLessons() {
        if(this.lessons.length > this.lessonsToKeep)
        {
            // Get current date
            var currentDate = new Date();
            // Subtract 7 days to current date.
            currentDate.setTime(currentDate.getTime() - 7 * 86400000);

            this.lessons = this.lessons.filter(lesson => {
                if(lesson.watched === true && (Laranotti.convertToDate(lesson.date) - currentDate) < 0)
                {
                    return false;
                }

                return true;
            });
        }
    }

}

export default Laranotti;
