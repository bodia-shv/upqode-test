'use strict';

// Load all dependencies
// -----------------------------------------------------------------------
var $    = require('gulp-load-plugins')();
var bs   = require('browser-sync').create();
var cfg  = require('./config.json');
var del  = require('del');
var gulp = require('gulp');
var path = require('path');
var pkg  = require('./package.json');

// Delete everything in dist folder
// -----------------------------------------------------------------------
gulp.task('clean', function() {
    return del(cfg.clean, {
        dot: true
    });
});

// Copy other files in src directory to dist/
// -----------------------------------------------------------------------
gulp.task('copy', function() {
    return gulp.src(cfg.copy.src, {dot: true})
        .pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
        .pipe($.size({title: 'copy', showFiles: true}))
        .pipe(gulp.dest(cfg.copy.dest));
});

// Process CSS files
// -----------------------------------------------------------------------
gulp.task('css', function() {
    return gulp.src(cfg.css.src)
        .pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 10,
            includePaths: require('node-normalize-scss').includePaths
        }))
        .pipe($.autoprefixer(cfg.autoprefixer))
        .pipe(gulp.dest(cfg.css.dest))
        .pipe($.cssnano())
        .pipe($.rename({suffix: '.min'}))
        .pipe($.sourcemaps.write('.'))
        .pipe($.size({title: 'css', showFiles: true}))
        .pipe(gulp.dest(cfg.css.dest))
        .pipe(bs.stream({match: '**/*.css'}));
});

// Process HTML files
// -----------------------------------------------------------------------
gulp.task('html', function() {
    return gulp.src(path.join(cfg.html.src, '*.html'))
        .pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
        .pipe($.htmlmin({
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        }))
        .pipe($.size({title: 'html', showFiles: true}))
        .pipe(gulp.dest(cfg.html.dest));
});

// Optimize images
// -----------------------------------------------------------------------
gulp.task('img', function() {
    return gulp.src(cfg.img.src)
        .pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
        .pipe($.changed(cfg.img.dest))
        .pipe($.imagemin({interlaced: true, progressive: true}))
        .pipe($.size({title: 'img', showFiles: true}))
        .pipe(gulp.dest(cfg.img.dest));
});


gulp.task('fonts', function() {
    return gulp.src(cfg.fonts.src)
        .pipe(gulp.dest(cfg.fonts.dest)) //выгружаем в build
});

// Process all JS files
// -----------------------------------------------------------------------
gulp.task('js', function() {
    return gulp.src(cfg.js.src)
        .pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
        .pipe($.cached('js'))
        .pipe($.remember('js'))
        .pipe($.sourcemaps.init())
        .pipe($.concat('app.js'))
        .pipe(gulp.dest(cfg.js.dest))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.sourcemaps.write('.'))
        .pipe($.size({title: 'js', showFiles: true}))
        .pipe(gulp.dest(cfg.js.dest));
});

// Run browser-sync and watch files
// -----------------------------------------------------------------------
gulp.task('serve', function() {
    // Init browsersync server
    bs.init({
        logPrefix: pkg.name,
        notify: false,
        port: 3000,
        server: 'dist'
    });

    // Watch for changes
    gulp.watch(cfg.css.src, ['css']);

    gulp.watch(cfg.copy.src, ['copy', bs.reload]).on('change', function (e) {
        if (e.type === 'deleted') {
            var filePathFromSrc = path.relative(path.resolve('src'), e.path);
            var destFilePath = path.resolve(cfg.copy.dest, filePathFromSrc);

            del.sync(destFilePath);
        }
    });

    gulp.watch(path.join(cfg.html.src, '**/*.html'), ['html', bs.reload]).on('change', function (e) {
        if (e.type === 'deleted') {
            var filePathFromSrc = path.relative(path.resolve(cfg.html.src), e.path);
            var destFilePath = path.resolve('dist', filePathFromSrc);

            del.sync(destFilePath);
        }
    });

    gulp.watch(cfg.img.src, ['img', bs.reload]).on('change', function (e) {
        if (e.type === 'deleted') {
            var filePathFromSrc = path.relative(path.resolve('src/img'), e.path);
            var destFilePath = path.resolve(cfg.img.dest, filePathFromSrc);

            del.sync(destFilePath);
        }
    });


    gulp.watch(cfg.fonts.src, ['fonts', bs.reload]).on('change', function (e) {
        if (e.type === 'deleted') {
            var filePathFromSrc = path.relative(path.resolve('src/fonts'), e.path);
            var destFilePath = path.resolve(cfg.fonts.dest, filePathFromSrc);

            del.sync(destFilePath);
        }
    });    


    gulp.watch(cfg.js.src, ['js', bs.reload]).on('change', function(e) {
        if (e.type === 'deleted') {
            delete $.cached.caches.js[e.path];
            $.remember.forget('js', e.path);
        }
    });
});



// Build everything
// -----------------------------------------------------------------------

gulp.task('build', ['copy', 'css', 'fonts', 'js', 'img', 'html'], function() {

  return gulp.src('dist/**/*').pipe($.size({title: 'build'}));
});
// Deploy to github pages
gulp.task('deploy', ['build'],  () => {
  return gulp.src('dist/**/*')
    .pipe($.ghPages());
});

// Default task
// -----------------------------------------------------------------------
gulp.task('default', ['clean'], () => {
    gulp.start('build');
});
