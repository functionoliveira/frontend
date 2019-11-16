const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const bourbon = require('bourbon').includePaths;
const neat = require('bourbon-neat').includePaths;
const concat = require('gulp-concat');

// const sass_lint = require('gulp-sass-lint');
// const image = require('gulp-image');

// gulp.task('images', function() {
//     return gulp.src('./src/images/**/')
//         .pipe(image())
//         .pipe(gulp.dest('./assets/img/'));
// });

gulp.task('scripts-components', function() {
    return gulp.src('./src/scripts/components/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./assets/js/components/'));
});

gulp.task('scripts-core', function() {
    return gulp.src('./src/scripts/core/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./assets/js/core/'));
});

gulp.task('scripts', function() {
    return gulp.src('./src/scripts/main.js')
        .pipe(gulp.dest('./assets/js/'));
});

gulp.task('components', function() {
    return gulp.src('./src/styles/components/base.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [].concat(bourbon, neat),
            errLogToConsole: true,
            outputStyle: 'expanded'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./assets/css/components/'));
});

gulp.task('modules', function() {
    return gulp.src('./src/styles/modules/base.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./assets/css/modules/'));
});

gulp.task('components-minify', gulp.series('components'), function() {
    return gulp.src('./assets/css/components/base.css')
    .pipe(cssnano())               
    .pipe(gulp.dest('./assets/css/components/'))
    .pipe(browserSync.stream());   
});

gulp.task('modules-minify', gulp.series('modules'), function() {
    return gulp.src('./assets/css/modules/base.css')
    .pipe(cssnano())               
    .pipe(gulp.dest('./assets/css/modules/'))
    .pipe(browserSync.stream());        
});

gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        open: false,             
        // proxy: "foo-client.dev", // The URL of our local project.
        watchOptions: {
          debounceDelay: 1000
        }
    });
    gulp.watch('./src/scripts/main.js', gulp.series('scripts'));
    gulp.watch('./src/scripts/components/**/*.js', gulp.series('scripts-components'));
    gulp.watch('./src/scripts/core/**/*.js', gulp.series('scripts-core'));
    gulp.watch('./src/styles/components/*.scss', gulp.series('components-minify'));
    gulp.watch('./src/styles/modules/*.scss', gulp.series('modules-minify'));
    gulp.watch('./src/scripts/**/*.js').on('change', browserSync.reload);
    gulp.watch('./src/styles/components/*.scss').on('change', browserSync.reload);
    gulp.watch('./src/styles/modules/*.scss').on('change', browserSync.reload);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('build', function() {
    return gulp.series('scripts', 'scripts-components', 'scripts-core', 'components-minify', 'modules-minify')();
});
