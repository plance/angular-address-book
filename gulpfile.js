var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', function () {
	gulp.watch('_data/scss/*.scss', ['scss-index']);
});

gulp.task('scss-index', function () {
    gulp.src('_data/scss/style.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('site/images/'));
});