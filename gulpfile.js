var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');

gulp.task('vendor', function() {
  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('js/vendor'));
});
