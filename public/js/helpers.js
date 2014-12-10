function createBasicNotificationForLesson(lessonId, title, message) {
    if (typeof chrome.notifications === 'object') {
        chrome.notifications.create(lessonId, {
            type: "basic",
            title: title,
            message: message,
            iconUrl: "laracasts-logo.jpg",
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
}

function createListNotificationForLessons(title, message, items) {
    if (typeof chrome.notifications === 'object') {
        chrome.notifications.create('list', {
            type: "list",
            title: title,
            message: message,
            items: items,
            iconUrl: "laracasts-logo.jpg",
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
}