/*chrome.notifications.create('example-notification', {
    type: "basic",
    title: "Case Study: The Laravel Installer",
    message: "To continue our learning, let's review the makeup of Laravel's command-line installer tool. In fact, we'll reproduce it from scratch!",
    iconUrl: "laracasts-logo.png",
    buttons: [
        {
            title: 'Watch'
        },
        {
            title: 'Mark as watched'
        }

    ]
}, function() {});


chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex)
{
    if(buttonIndex == 0)
    {
        alert('Watch lesson');
    }
    if(buttonIndex == 1)
    {
        alert('Mark lesson as watched')
    }
});*/

var data = [
    {
        heading: "How to Build Command-Line Apps",
        text: "In this series, we'll learn how how to build command-line apps from scratch, using Symfony's excellent console component. In no time, you'll be whipping up executables to perform all sorts of tasks.",
        link: "https://laracasts.com/series/how-to-build-command-line-apps-in-php"
    },
    {
        heading: "Case Study: The Laravel Installer",
        text: "To continue our learning, let's review the makeup of Laravel's command-line installer tool. In fact, we'll reproduce it from scratch!",
        link: "https://laracasts.com/series/how-to-build-command-line-apps-in-php/episodes/4"
    },
    {
        heading: "Laravel and the Front-end",
        text: "Let's take a break from the back-end, and instead focus on that other world: the front-end! Don't worry, Laravel 5 has made this process as enjoyable as it can be. We'll review everything from Bower to Laravel Elixir.",
        link: "https://laracasts.com/series/laravel-5-and-the-front-end"
    },
    {
        heading: "Elixir TDD",
        text: "We can also use Elixir to assist with test-driven development. Let me show you what I mean!",
        link: "https://laracasts.com/series/laravel-5-and-the-front-end/episodes/5"
    },
    {
        heading: "Elixir Asset Concatenation",
        text: "To save on countless HTTP requests, you'll often want to merge, or concatenate, any number of stylesheets or scripts. Let me show you how to do this, using Laravel Elixir.",
        link: "https://laracasts.com/series/laravel-5-and-the-front-end/episodes/4"
    }
];


var data2 = [
    {
        heading: "How to Build Command-Line Apps",
        text: "In this series, we'll learn how how to build command-line apps from scratch, using Symfony's excellent console component. In no time, you'll be whipping up executables to perform all sorts of tasks.",
        link: "https://laracasts.com/series/how-to-build-command-line-apps-in-php"
    },
    {
        heading: "Case Study: The Laravel Installer",
        text: "To continue our learning, let's review the makeup of Laravel's command-line installer tool. In fact, we'll reproduce it from scratch!",
        link: "https://laracasts.com/series/how-to-build-command-line-apps-in-php/episodes/4"
    },
    {
        heading: "Laravel and the Front-end",
        text: "Let's take a break from the back-end, and instead focus on that other world: the front-end! Don't worry, Laravel 5 has made this process as enjoyable as it can be. We'll review everything from Bower to Laravel Elixir.",
        link: "https://laracasts.com/series/laravel-5-and-the-front-end"
    },
    {
        heading: "Elixir TDD",
        text: "We can also use Elixir to assist with test-driven development. Let me show you what I mean!",
        link: "https://laracasts.com/series/laravel-5-and-the-front-end/episodes/5"
    },
    {
        heading: "Elixir Asset Concatenation2",
        text: "To save on countless HTTP requests, you'll often want to merge, or concatenate, any number of stylesheets or scripts. Let me show you how to do this, using Laravel Elixir.",
        link: "https://laracasts.com/series/laravel-5-and-the-front-end/episodes/4"
    }
];


function json_diff(jsons) {
    findDifferences: for (var json in jsons) {

        var difference = [];

        for(var i = 0; i < json.length; i++)
        {
            var different = false;

            for(var propertyName in json[i])
            {

                if(json[i][propertyName] != feed2[i][propertyName])
                {

                    different = true;
                    console.log('different');
                    break;
                }
            }

            if(different) {
                difference.push(json[i]);
            }

        }

    }
}

var feed_diff = function(feed1, feed2)
{
    var difference = [];

    for(var i = 0; i < feed1.length; i++)
    {


        var different = false;

        for(var propertyName in feed1[i])
        {


            if(feed1[i][propertyName] != feed2[i][propertyName])
            {

                different = true;
                console.log('different');
                break;
            }
        }

        if(different) {
            difference.push(feed1[i]);
        }

    }

    return difference;
};

console.log(feed_diff(data, data2));