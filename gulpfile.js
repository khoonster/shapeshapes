var gulp = require('gulp');
var concat = require('gulp-concat');
var mainBowerFiles = require('main-bower-files');
var browserify = require('gulp-browserify');

var sources = {
  paper: {
    main: '_ps/main.js',
    modules: '_ps/modules/**/*.js'
  },
  javascript: '_js/main.js'
}

var destinations = {
  paper: 'ps',
  javascript: 'js',
  vendor: 'js/vendor'
}

gulp.task('javascript', function() {
  gulp.src(sources.javascript)
    .pipe(browserify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(destinations.javascript))
})

gulp.task('vendor', function() {
  gulp.src(mainBowerFiles())
    .pipe(gulp.dest(destinations.vendor));
})

gulp.task('paper', function() {
  gulp.src([sources.paper.main])
    .pipe(browserify())
    .pipe(concat('main.paper.js'))
    .pipe(gulp.dest(destinations.paper));
})

gulp.task('watch', function() {
  gulp.watch([sources.paper.main, sources.paper.modules], ['paper']);
  gulp.watch(sources.javascript, ['javascript']);
})

gulp.task('default', ['javascript', 'vendor', 'paper', 'watch'])
