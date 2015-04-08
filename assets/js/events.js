var Laranotti = require('./Laranotti.js');

function resolveAlarm(alarm) {
    // |alarm| can be undefined because onAlarm also gets called from
    // window.setTimeout on old chrome versions.
    if (alarm && alarm.name == 'pollInterval') {
        // This also fetches new lessons from Laracasts

        var laranotti = new Laranotti;
        laranotti.checkForNewLessons();
    }
}


// Clear all alarms
// chrome.alarms.clearAll();

// Add a listener to resolve alarms
chrome.alarms.onAlarm.addListener(resolveAlarm);

// Create a new alarm for fetching feed from Laracasts
chrome.alarms.create('pollInterval', {periodInMinutes: 60});


chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
    var laranotti = new Laranotti;

    if (notificationId == 'list') {
        if (buttonIndex == 0) {
            //TODO: Fix this to only mark new lessons watched
            laranotti.markAllLessonsWatched();

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
            chrome.tabs.create({
                url: laranotti.lessons[parseInt(notificationId)].link
            }, function (tab) {
                // when tab is closed mark lesson as watched
                chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
                    // If the tab closed is the tab with  the lesson opened
                    if (tab.id == tabId) {
                        laranotti.toggleLessonWatched(notificationId);
                    }
                });
            });

            chrome.notifications.clear(notificationId, function (wasCleared) { });

        }
        if (buttonIndex == 1) {
            laranotti.toggleLessonWatched(notificationId);

            chrome.notifications.clear(notificationId, function (wasCleared) { });

            //TODO: Notify Notifier React.js extension to update state somehow
        }
    }

});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    // when tab is closed mark lesson as watched
    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
        // If the tab closed is the tab with  the lesson opened
        if (request.tabId == tabId) {

            var laranotti = new Laranotti;

            laranotti.toggleLessonWatched(request.lessonId);

            sendResponse();
        }
    });

});