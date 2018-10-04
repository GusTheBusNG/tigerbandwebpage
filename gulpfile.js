const gulp = require('gulp');
const browserSync = require('browser-sync');
const connect = require('gulp-connect-php');

const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const del = require('del');
const runSequence = require('run-sequence');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

gulp.task('default', function (callback) {
  runSequence('sass', 'css', 'watch', callback);
});

gulp.task('build', function (callback) {
  runSequence('clean:prod', 'sass', 'css',
    ['move-html-php-to-prod', 'minify-css', 'images', 'drumline', 'cutba', 'move-docs'],
    callback
  );
});

gulp.task('test:prod', function () {
  connect.server({ 'base': './prod' }, function () {
    browserSync({
      proxy: '127.0.0.1:8000'
    });
  });
})

gulp.task('watch', ['browserSync'], function () {
  const mainFiles = ['./app/**/*.php', './app/**/*.html', './app/**/*.js'];

  gulp.watch('./app/css/*.sass', ['sass']);
  gulp.watch('./app/css/*.css', ['css']);

  gulp.watch('./app/drumline/css/*.sass', ['drumline-sass']);
  gulp.watch('./app/drumline/css/*.css', ['drumline-css-app']);

  gulp.watch('./app/cutba/css/*.sass', ['cutba-sass']);
  gulp.watch('./app/cutba/css/*.css', ['cutba-css-app']);

  mainFiles.forEach(function (file) {
    gulp.watch(file, browserSync.reload);
  });
});

gulp.task('browserSync', function () {
  connect.server({ 'base': './app' }, function () {
    browserSync({
      proxy: '127.0.0.1:8000'
    });
  });
});

gulp.task('sass', function () {
  return gulp.src('./app/css/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('css', function () {
  del.sync('./app/css/main.css')
  return gulp.src('./app/css/*.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./app/css/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('move-html-php-to-prod', function () {
  return gulp.src(['./app/**/*.php', './app/**/*.html'])
    .pipe(gulp.dest('./prod/'));
});

gulp.task('images', function () {
  return gulp.src(['./app/img/*',
    './app/img/**/*'])
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('./prod/img'));
});

gulp.task('minify-css', () => {
  return gulp.src('./app/css/main.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./prod/css/'));
});

gulp.task('clean:prod', function () {
  return del.sync('./prod');
});

gulp.task('cache:clear', function (callback) {
  return cache.clearAll(callback);
});

gulp.task('move-docs', function () {
  return gulp.src(['./app/doc/*', './app/doc/**/*'])
    .pipe(gulp.dest('./prod/doc'));
})


// Doing drumline stuff

gulp.task('drumline', function () {
  runSequence(['drumline-move-docs', 'drumline-css-prod', 'drumline-images', 'drumline-move-extra']);
});

gulp.task('drumline-sass', function () {
  return gulp.src('./app/drumline/css/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/drumline/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('drumline-css-app', function () {
  return gulp.src(['./app/css/main.css', './app/drumline/css/*.css'])
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./app/drumline/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
})

gulp.task('drumline-css-prod', function () {
  return gulp.src('./app/drumline/css/main.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./prod/drumline/css/'));
});

gulp.task('drumline-images', function () {
  return gulp.src(['./app/drumline/img/*',
    './app/drumline/img/**/*'])
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('./prod/drumline/img'));
});

gulp.task('drumline-move-docs', function () {
  return gulp.src(['./app/drumline/doc/*', './app/drumline/doc/**/*'])
    .pipe(gulp.dest('./prod/drumline/doc'));
});

gulp.task('drumline-move-extra', function () {
  return gulp.src(['./app/drumline/*', '!./app/drumline/*.html'])
    .pipe(gulp.dest('./prod/drumline/'));
});

// Doing cutba stuff

gulp.task('cutba', function (callback) {
  runSequence(['cutba-move-docs', 'cutba-css-prod', 'cutba-images']);
});

gulp.task('cutba-sass', function () {
  return gulp.src('./app/cutba/css/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/cutba/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('cutba-css-app', function () {
  return gulp.src(['./app/css/main.css', './app/cutba/css/*.css'])
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./app/cutba/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
})

gulp.task('cutba-css-prod', function () {
  return gulp.src('./app/cutba/css/main.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./prod/cutba/css/'));
});

gulp.task('cutba-images', function () {
  return gulp.src(['./app/cutba/img/*',
    './app/cutba/img/**/*'])
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('./prod/cutba/img'));
});

gulp.task('cutba-move-docs', function () {
  return gulp.src(['./app/cutba/doc/*', './app/cutba/doc/**/*'])
    .pipe(gulp.dest('./prod/cutba/doc'));
})