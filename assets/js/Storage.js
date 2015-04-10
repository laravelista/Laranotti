import $ from 'jquery';

class Storage {

    /**
     * It gets lessons from localStorage.
     *
     * @returns {*}
     */
    static getLessons() {
        var lessons = localStorage['lessons'];

        if(lessons !== undefined) lessons = JSON.parse(lessons);

        if(lessons === undefined) lessons = [];

        return lessons;
    }

    /**
     * It stores lessons in localScope.
     *
     * @param lessons
     */
    static storeLessons(lessons) {
        localStorage['lessons'] = JSON.stringify(lessons);
    }

}

export default Storage;