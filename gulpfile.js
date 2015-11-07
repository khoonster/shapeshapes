var gulp = require('gulp');
var concat = require('gulp-concat');
var mainBowerFiles = require('main-bower-files');
var browserify = require('gulp-browserify');
var jslint = require('gulp-jslint');

var sources = {
  paper: {
    main: '_ps/main.js',
    grid: '_ps/grid.js',
    modules: '_ps/modules/**/*.js',
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
  var roots = [sources.paper.main, sources.paper.grid]

  roots.forEach(function(root) {
    gulp.src([root])
      .pipe(browserify())
      .pipe(concat(toPaperName(root)))
      .pipe(gulp.dest(destinations.paper));
  });
})

gulp.task('check', function() {
  gulp.src([sources.paper.main, sources.paper.grid, sources.paper.modules])
    .pipe(jslint({
      node: true,
      white: true
    }))
    .on('error', function(error) {
      console.error(String(error));
    })
})

gulp.task('watch', function() {
  gulp.watch([sources.paper.main, sources.paper.grid, sources.paper.modules], ['paper']);
  gulp.watch(sources.javascript, ['javascript']);
})

gulp.task('default', ['javascript', 'vendor', 'paper', 'watch'])

function toPaperName(path) {
  var filename = path.split('/')[1];
  var parts = filename.split('.');

  parts.splice(1, 0, 'paper');

  return parts.join('.');
}
