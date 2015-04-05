var $ = require('jquery');

/* This is a fix for Bootstrap requiring jQuery */
global.jQuery = require('jquery');
require('bootstrap');

var React = require('react');
var Notifier = require('./components/Notifier.js');

/**
 * PoolInterval is not being used at the moment.
 * I think that there is no use for it now because of background eventPage.
 */
React.render(
    <Notifier url="http://laracasts-feed.mariobasic.com/api/v1/feed/lessons" pollInterval={2000} />,
    document.getElementById('notifier')
);
