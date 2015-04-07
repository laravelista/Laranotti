var $ = require('jquery');

/* This is a fix for Bootstrap requiring jQuery */
global.jQuery = require('jquery');
require('bootstrap');

var React = require('react');
var Notifier = require('./components/Notifier.js');
var Laranotti = require('./Laranotti.js');

var laranotti = new Laranotti;

React.render(
    <Notifier laranotti={laranotti} />,
    document.getElementById('notifier')
);
