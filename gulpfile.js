const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const del = require('del');
const browserSync = require('browser-sync').create();

function errorHandler(error) {
  notify.onError({
    message: 'Error: <%= error.message %>',
  })(error);
  this.emit('end');
}

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
  });
});

gulp.task('clean', () => del.sync([
  'dist/**/*',
  '!dist/favicon.ico',
  '!dist/manifest.json',
]));

gulp.task('images', () => gulp.src('src/images/**/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/images')));

gulp.task('js', () => gulp.src('src/js/**/*.js')
  .pipe(concat('bundle.js'))
  .pipe(babel({
    presets: ['es2015'],
  }))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'))
  .pipe(browserSync.stream()));

gulp.task('pug', () => gulp.src('src/*.pug')
  .pipe(plumber({ errorHandler }))
  .pipe(pug())
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream()));

gulp.task('sass', () => gulp.src('src/scss/**/*.scss')
  .pipe(plumber({ errorHandler }))
  .pipe(sass({ outputStyle: 'compressed' }))
  .pipe(autoprefixer())
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.stream()));

gulp.task('watch', ['default'], () => {
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/**/*.pug', ['pug']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
});

gulp.task('default', ['browser-sync', 'clean', 'images', 'js', 'pug', 'sass']);
