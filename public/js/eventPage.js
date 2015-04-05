var Laracasts = {

    lessons: [],

    url: "http://laracasts-feed.mariobasic.com/api/v1/feed/lessons",

    prepareLessons: function (lessons) {
        lessons.map(function (lesson) {
            lesson.watched = false;
        });

        return lessons;
    },

    getLessonsFromStorage: function () {

        var deferredObject = $.Deferred();

        var lessons = localStorage['lessons'];

        if(lessons !== undefined) lessons = JSON.parse(lessons);

        if(lessons === undefined) lessons = [];

        this.lessons = lessons;

        deferredObject.resolve(this);

        return deferredObject.promise();
    },

    getLessonsFromStorageAndUpdate: function () {

        var lessons = localStorage['lessons'];

        if(lessons !== undefined) lessons = JSON.parse(lessons);

        if(lessons === undefined) lessons = [];

        this.lessons = lessons;

        this.fetchFeedFromLaracasts();
    },

    searchForLessonByTitle: function (title) {
        for (var i = 0; i < this.lessons.length; i++) {
            if (title == this.lessons[i].title) {
                return i;
            }
        }
    },

    storeLessons: function () {
        localStorage['lessons'] =  JSON.stringify(this.lessons);
    },

    updateBadge: function () {
        // Count number of unwatched lessons from state
        var numberOfUnwatchedLessons = this.lessons.filter(function (lesson) {
            return lesson.watched == false;
        }).length;

        if(numberOfUnwatchedLessons == 0) numberOfUnwatchedLessons = '';

        chrome.browserAction.setBadgeText({text: numberOfUnwatchedLessons.toString()});
    },

    markAllWatched: function () {

        var lessons = this.lessons;

        lessons.forEach(function (lesson) {
            lesson.watched = true;
        });

        this.lessons = lessons;

        this.updateBadge();

        this.storeLessons();
    },

    toggleWatched: function (key) {

        var lessons = this.lessons;

        lessons[key].watched = lessons[key].watched == false;

        this.lessons = lessons;

        this.updateBadge();

        this.storeLessons();
    },

    fetchFeedFromLaracasts: function () {

        var that = this;

        $.ajax({
            url: this.url,
            dataType: 'json',
            success: function (data) {
                var feed = this.prepareLessons(data);

                var lessons = this.lessons;

                var newLessons = feed.filter(function (item) {
                    for (var i = 0; i < that.lessons.length; i++) {
                        if (item.title == that.lessons[i].title) {
                            return false;
                        }
                    }
                    lessons.unshift(item);

                    return true;
                });

                // Sort by Date
                lessons.sort(function (a, b) {
                    return new Date(b.date) - new Date(a.date);
                });

                this.lessons = lessons;

                if (newLessons.length == 1) {
                    var id = this.searchForLessonByTitle(newLessons[0].title);
                    createBasicNotificationForLesson(id.toString(), newLessons[0].title, newLessons[0].summary);
                }
                else if (newLessons.length > 1) {
                    var items = [];
                    newLessons.forEach(function (lesson) {
                        items.push({title: lesson.title, message: lesson.summary});
                    });
                    createListNotificationForLessons(newLessons.length.toString() + ' New Lessons on Laracasts.', 'You have ' + newLessons.length.toString() + 'lessons unwatched.', items);
                }

                this.updateBadge();

                this.storeLessons();

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });

    }
};

function resolveAlarm(alarm) {
    // |alarm| can be undefined because onAlarm also gets called from
    // window.setTimeout on old chrome versions.
    if (alarm && alarm.name == 'pollInterval') {
        // This also fetches new lessons from Laracasts
        Laracasts.getLessonsFromStorageAndUpdate();
    }
}


// Clear all alarms
// chrome.alarms.clearAll();

// Add a listener to resolve alarms
chrome.alarms.onAlarm.addListener(resolveAlarm);

// Create a new alarm for fetching feed from Laracasts
chrome.alarms.create('pollInterval', {periodInMinutes: 60});


chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
    if (notificationId == 'list') {
        if (buttonIndex == 0) {
            Laracasts.getLessonsFromStorage().done(function (Laracasts) {
                Laracasts.markAllWatched()
            });

            chrome.notifications.clear(notificationId, function (wasCleared) { });
        }
        if (buttonIndex == 1) {
            chrome.tabs.create({
                url: "https://laracasts.com/lessons"
            });
            chrome.notifications.clear(notificationId, function (wasCleared) { });
        }
    }
    else {
        if (buttonIndex == 0) {
            //open a tab to watch lesson on laracasts

            Laracasts.getLessonsFromStorage().done(function (Laracasts) {

                chrome.tabs.create({
                    url: Laracasts.lessons[parseInt(notificationId)].link
                }, function (tab) {
                    // when tab is closed mark lesson as watched
                    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
                        // If the tab closed is the tab with  the lesson opened
                        if (tab.id == tabId) {
                            Laracasts.getLessonsFromStorage().done(function (Laracasts) {
                                // Mark it as watched
                                Laracasts.toggleWatched(notificationId);
                            });
                        }
                    });
                });

                chrome.notifications.clear(notificationId, function (wasCleared) { });

            });


        }
        if (buttonIndex == 1) {

            Laracasts.getLessonsFromStorage().done(function (Laracasts) {
                // mark that lesson watched
                // (I assume that it is unwatched)
                Laracasts.toggleWatched(notificationId);

                chrome.notifications.clear(notificationId, function (wasCleared) { });
            });

        }
    }

});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    // when tab is closed mark lesson as watched
    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
        // If the tab closed is the tab with  the lesson opened
        if (request.tabId == tabId) {
            Laracasts.getLessonsFromStorage().done(function (Laracasts) {
                // Mark it as watched
                Laracasts.toggleWatched(request.lessonId);

                sendResponse();
            });
        }
    });

});