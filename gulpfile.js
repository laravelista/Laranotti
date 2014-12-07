/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var react = require('gulp-react');
var elixir = require('laravel-elixir');

elixir.extend("react", function () {

    gulp.task('react', function () {
        return gulp.src('assets/react/**/*.jsx')
            .pipe(react())
            .pipe(concat('jsx.js'))
            .on('error', gutil.log)
            .pipe(gulp.dest('public/js/'));
    });

    this.registerWatcher("react", "assets/react/**/*.jsx");

    return this.queueTask("react");

});

elixir(function (mix) {
    mix.sass('app.scss')
        .publish(
        'jquery/dist/jquery.min.js',
        'public/js/vendor/jquery.js'
    )
        .publish(
        'bootstrap-sass-official/assets/javascripts/bootstrap.js',
        'public/js/vendor/bootstrap.js'
    )
        .publish(
        'font-awesome/css/font-awesome.min.css',
        'public/css/vendor/font-awesome.css'
    )
        .publish(
        'font-awesome/fonts',
        'public/css/fonts'
    )
        .publish(
        'react/react.min.js',
        'public/js/vendor/react.js'
    )
        .react();
});