import $ from 'jquery';

class Chrome {

    /**
     * Checks if the browsers support google chrome notifications API.
     *
     * @returns {boolean}
     */
    static supportsChromeNotifications() {
        if (typeof chrome.notifications !== 'object') {
            console.log('chrome.notifications not supported!');
            return false;
        }

        return true;
    }

    /**
     * Checks if the browsers support google chrome notifications API.
     *
     * @returns {boolean}
     */
    static supportsChromeBrowserAction() {
        if (typeof chrome.browserAction !== 'object') {
            console.log('chrome.browserAction not supported!');
            return false;
        }

        return true;
    }

    /**
     * It creates a basic notification for a single lesson.
     *
     * @param lessonId
     * @param title
     * @param message
     * @returns {boolean}
     */
    static createBasicNotificationForLesson(lessonId, title, message) {

        if ( ! Chrome.supportsChromeNotifications()) return false;

        chrome.notifications.create(lessonId, {
            type: "basic",
            title: title,
            message: message,
            iconUrl: "graphics/laranotti-notification-160.png",
            buttons: [
                {
                    title: 'Watch'
                },
                {
                    title: 'Mark as Watched'
                }
            ]
        }, function () {
        });

    }

    /**
     * It creates a list notification for lessons.
     *
     * @param title
     * @param message
     * @param items
     * @returns {boolean}
     */
    static createListNotificationForLessons(title, message, items) {

        if ( ! Chrome.supportsChromeNotifications()) return false;

        chrome.notifications.create('list', {
            type: "list",
            title: title,
            message: message,
            items: items,
            iconUrl: "graphics/laranotti-notification-160.png",
            buttons: [
                {
                    title: 'Mark all Watched'
                },
                {
                    title: 'View on Laracasts'
                }
            ]
        }, function () {
        });

    }

    /**
     * It changes the extension badge text.
     *
     * @param value
     * @returns {boolean}
     */
    static changeBadgeValue(value) {

        if ( ! Chrome.supportsChromeBrowserAction()) return false;

        if(value == 0) value = '';

        chrome.browserAction.setBadgeText({text: value});
    }

}

export default Chrome;