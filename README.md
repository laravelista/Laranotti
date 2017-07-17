# Laranotti

![ ](http://img.shields.io/gratipay/mabasic.svg) [![Join the chat at https://gitter.im/laravelista/Laranotti](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/laravelista/Laranotti?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**Discontinued**

~~Install from [Google Chrome store page](https://chrome.google.com/webstore/detail/laracasts-notifier/aidlbngabkfmnfmfjgnmfhihjcpdbbjo)~~

~~I have opened a topic on [Laracasts forum](https://laracasts.com/discuss/channels/general-discussion/laracasts-notifier-extension-for-google-chrome) for discussions.~~

~~If you are going to tweet about it please use `#Laranotti` and help me spread the news, thank you.~~

## Description

This extension fetches and notifies you of latest lessons from [Laracasts](https://laracasts.com) in your Google Chrome browser.

**Laranotti checks for new lessons every 60 minutes from my [API](https://github.com/mabasic/laracasts-feed) which caches the response for 30 minutes :)**

## Features

- Fetches latest lessons from Laracasts
- Mark lesson as watched or unwatched
- Mark all lessons as watched
- Manually fetch lessons from Laracasts
- Extension badge notifies the user how many unwatched lessons he has
- Desktop notifications
- Background events
- Automatically fetch new lessons from Laracasts
- Detects when you have closed the tab of the lesson you were watching and marks it as watched

## Screenshots

![ ](screenshot.png)

## For development

I am using Laravel Elixir, so you can use it like so:

One time run:

```
gulp
```

Run and watch for changes:

```
gulp watch
```
