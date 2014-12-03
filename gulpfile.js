var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var react = require('gulp-react');

gulp.task('react', function () {
    return gulp.src('assets/react/**/*.jsx')
        .pipe(react())
        .on('error', gutil.log)
        .pipe(concat('jsx.js'))
        .pipe(gulp.dest('js/'));
});

gulp.task('watch', ['react'], function () {
    gulp.watch('assets/react/**/*.jsx', ['react']);
});

gulp.task('default', ['react', 'watch']);