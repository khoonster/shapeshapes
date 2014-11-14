var gulp = require('gulp');
var concat = require('gulp-concat');
var mainBowerFiles = require('main-bower-files');

var sources = {
  paper: ['_ps/modules/**/*.js', '_ps/main.js'],
  javascript: '_js/main.js'
}

var destinations = {
  paper: 'ps',
  javascript: 'js',
  vendor: 'js/vendor'
}

gulp.task('javascript', function() {
  gulp.src(sources.javascript)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(destinations.javascript))
})

gulp.task('vendor', function() {
  gulp.src(mainBowerFiles())
    .pipe(gulp.dest(destinations.vendor));
})

gulp.task('paper', function() {
  gulp.src(sources.paper)
    .pipe(concat('main.paper.js'))
    .pipe(gulp.dest(destinations.paper));
})

gulp.task('watch', function() {
  gulp.watch(sources.paper, ['paper']);
  gulp.watch(sources.javascript, ['javascript']);
})

gulp.task('default', ['javascript', 'vendor', 'paper', 'watch'])
