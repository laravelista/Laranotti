var Laranotti = require('./Laranotti.js');

/**
 * Whenever an alarms sets off, this function
 * gets called to detect the alarm name and
 * do appropriate action.
 *
 * @param alarm
 */
function resolveAlarm(alarm) {
    // |alarm| can be undefined because onAlarm also gets called from
    // window.setTimeout on old chrome versions.
    if (alarm && alarm.name == 'refreshFeedFromLaracasts') {

        var laranotti = new Laranotti;

        laranotti.checkForNewLessons();
    }
}

/**
 * Detect if `mark all watched`
 * button is clicked.
 * (List notification only)
 *
 * @param buttonIndex
 * @returns {boolean}
 */
function markAllWatchedButtonClicked(buttonIndex) {
    return buttonIndex == 0;
}

/**
 * Detect if `view on laracasts`
 * button is clicked.
 * (List notification only)
 *
 * @param buttonIndex
 * @returns {boolean}
 */
function viewOnLaracastsButtonClicked(buttonIndex) {
    return buttonIndex == 1;
}

/**
 * Detect if notification is list.
 *
 * @param notificationId
 * @returns {boolean}
 */
function notificationIsList(notificationId) {
    return notificationId == 'list';
}

/**
 * Detect if `watch lesson`
 * button is clicked
 * (Basic notification only)
 *
 * @param buttonIndex
 * @returns {boolean}
 */
function watchLessonButtonClicked(buttonIndex) {
    return buttonIndex == 0;
}

/**
 * Detect if `mark as watched`
 * button is clicked.
 * (Basic notification only)
 *
 * @param buttonIndex
 * @returns {boolean}
 */
function markAsWatchedButtonClicked(buttonIndex) {
    return buttonIndex == 1;
}


// Clear all alarms
// chrome.alarms.clearAll();

// Add a listener to resolve alarms
chrome.alarms.onAlarm.addListener(resolveAlarm);

// Create a new alarm for fetching feed from Laracasts
chrome.alarms.create('refreshFeedFromLaracasts', {periodInMinutes: 60});


chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {

    var laranotti = new Laranotti;

    if(notificationIsList(notificationId)) {

        if(markAllWatchedButtonClicked(buttonIndex)) {

            laranotti.markNewLessonsWatched();

            chrome.notifications.clear(notificationId, function () {});

            //Notify Notifier React.js extension to update state
            chrome.runtime.sendMessage({action: 'updateState'});
        }

        if(viewOnLaracastsButtonClicked(buttonIndex)) {

            chrome.tabs.create({
                url: "https://laracasts.com/lessons"
            });

            chrome.notifications.clear(notificationId, function () {});
        }

    }
    else {

        if(watchLessonButtonClicked(buttonIndex)) {

            //open a tab to watch lesson on laracasts
            chrome.tabs.create({
                url: laranotti.lessons[parseInt(notificationId)].link
            }, tab => {
                // when tab is closed mark lesson as watched
                chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
                    // If the tab closed is the tab with  the lesson opened
                    if (tab.id == tabId) {
                        laranotti.toggleLessonWatched(notificationId);
                    }
                });
            });

            chrome.notifications.clear(notificationId, function () {});
        }

        if(markAsWatchedButtonClicked(buttonIndex)) {

            laranotti.toggleLessonWatched(notificationId);

            chrome.notifications.clear(notificationId, function () {});

            //Notify Notifier React.js extension to update state
            chrome.runtime.sendMessage({action: 'updateState'});
        }

    }

});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if(request.action == 'detectLessonTabClosed') {
        chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
            // If the tab closed is the tab with  the lesson opened
            if (request.tabId == tabId) {

                var laranotti = new Laranotti;

                laranotti.toggleLessonWatched(request.lessonId);
            }
        });
    }

});