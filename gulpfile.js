const gulp = require('gulp')
const less = require('gulp-less')
const cleanCSS = require('gulp-clean-css')
const concat = require('gulp-concat')
const del = require('del')
const browserSync = require('browser-sync').create()
const jade = require('gulp-jade')
const sass = require('gulp-sass')

const destName = 'public'

 // cборка шаблонов
gulp.task('templates', function buildHTML () {
  return gulp.src('./source/pages/*.jade')
    .pipe(jade({
        // Your options in here.
    }))
    .pipe(gulp.dest(destName))
})

// cборка стилей
gulp.task('style', function () {
    // в source/styles сразу берет style.scss
  return gulp.src('./source/style/style.scss')
        .pipe(sass()) // переводит sass в обычный css
        .pipe(cleanCSS({
          compatibility: 'ie8'
        })) // минимизируем файл
        .pipe(gulp.dest(destName + '/styles')) // отправляем получившийся результат в папку public
})

// переносит все картинки и шрифты в public
gulp.task('assets', function () {
  return gulp.src('source/assets/**/*')
        .pipe(gulp.dest(destName))
})

// очищаем папку public
gulp.task('clean', function () {
  return del(destName)
})

// следит за измененим стилей и ассетсов, и если что-то в файлах изменилось, запускает соответсвующие задачи
gulp.task('watch', function () {
  gulp.watch('source/**/*.scss', gulp.series('style'))
  gulp.watch('source/assets/**/*.*', gulp.series('assets'))
  gulp.watch('source/**/*.jade', gulp.series('templates'))
})

gulp.task('serve', function () {
  browserSync.init({
    server: destName
  })

  browserSync.watch(destName + '/**/*.*').on('change', browserSync.reload)
})

// просто собирает проект
gulp.task('build', gulp.series('clean', 'style', 'templates', 'assets'))

// собирает проект, а потом следит за изменениями
gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')))
