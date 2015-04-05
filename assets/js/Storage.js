import $ from 'jquery';

class Storage {

    static getLessons() {
        var lessons = localStorage['lessons'];

        if(lessons !== undefined) lessons = JSON.parse(lessons);

        if(lessons === undefined) lessons = [];
        
        return lessons;
    }

    static storeLessons(lessons) {
        localStorage['lessons'] = JSON.stringify(lessons);
    }

}

export default Storage;