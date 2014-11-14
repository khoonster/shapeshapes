var gulp = require('gulp');
var concat = require('gulp-concat');
var mainBowerFiles = require('main-bower-files');

var sources = {
  paper: ['_ps/modules/**/*.js', '_ps/main.js']
}

var destinations = {
  vendor: 'js/vendor',
  paper: 'ps'
}

gulp.task('vendor', function() {
  gulp.src(mainBowerFiles())
    .pipe(gulp.dest(destinations.vendor));
});

gulp.task('paper', function() {
  gulp.src(sources.paper)
    .pipe(concat('main.paper.js'))
    .pipe(gulp.dest(destinations.paper));
})

gulp.task('watch', function() {
  gulp.watch(sources.paper, ['paper']);
})

gulp.task('default', ['vendor', 'paper', 'watch'])
