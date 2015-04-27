var gulp = require('gulp'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    reactify = require('reactify');

gulp.task('browserify', function() {
    var bundler = browserify({
        entries: ['./src/app.jsx'],
        extensions: ['.jsx'],
        transform: [reactify],
        debug: true,
        cache: {}, packageCache: {}, fullPaths: true
    });

    var bundler = watchify(bundler);

    function rebundle() {
        var startTime = new Date().getTime();
        return bundler.bundle()
        .on('error', function(err) {
            err.stream = undefined;
            gutil.log("js error:", err);
            gutil.beep();
        })
        .pipe(source('all.js'))
        .pipe(gulp.dest('./build/'))
        .on('end', function() {
            var now = new Date();
            var time = (now.getTime() - startTime) / 1000;
            return console.log('[' + now.getHours() + ":"  + now.getMinutes() + ":" + now.getSeconds() + '] ' + " updated: " + (time + 's'));
        });
    };

    bundler.on('update', rebundle);

    return rebundle();

});

gulp.task('watch', ['browserify']);
