var gulp = require('gulp'),
    $ = require("gulp-load-plugins")({
        pattern: ["*"],
        scope: ["devDependencies"]
    }),
    onError = (err) => {
        console.log(err);
    },
    browserSync = require("browser-sync").create();

var paths = {
    styles: {
        src: 'styles/style.scss',
        all: 'styles/**/*.scss',
        build: 'css'
    },
    html: {
        src: '*.html'
    },
    js: {
        src: 'js/**/*.js'
    },
    images: {
        src: 'images/*.+(jpg|JPG|png|svg)',
        build: 'images'
    }
};

gulp.task('styles', function () {
    return gulp.src(paths.styles.src)
        .pipe($.plumber({errorHandler: onError}))
        .pipe($.sassGlob({
            ignorePaths: [
                "styles/utils/**",
                "styles/base/**",
            ]
        }))
        .pipe($.sass())
        .pipe($.postcss([
                require("postcss-assets")({
                    loadPaths: ["images/"]
                }),
                require("autoprefixer"),
                require("postcss-easysprites")({
                    imagePath: "images/sprite",
                    spritePath: "images"
                }),
                require('postcss-css-variables'),
                require("css-mqpacker")({
                    sort: sortMediaQueries
                })
            ])
        )
        .pipe($.csscomb())
        .pipe($.stylefmt())
        .pipe($.cleanCss())
        .pipe(gulp.dest(paths.styles.build))
        .pipe(browserSync.stream());
});

gulp.task('images', function () {
    gulp.src(paths.images.src)
        .pipe($.tinypng('BLZpO1PPn1JhAC0IBa8ncwiTmWm93ySw'))
        .pipe(gulp.dest(paths.images.build));
});

gulp.task('webp', function () {
    return gulp.src(paths.images.src)
        .pipe($.webp({
            autoFilter: true,
            quality: 95
        }))
        .pipe(gulp.dest(paths.images.build))
});

gulp.task("server", ['styles'], function () {
    browserSync.init({
        notify: false,
        open: false,
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(paths.styles.all, ['styles']);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("js/*.js").on('change', browserSync.reload);
});

gulp.task('default', ['styles', "server"]);
gulp.task('build', ['styles']);

function isMax(mq) {
    return /max-width/.test(mq);
}

function isMin(mq) {
    return /min-width/.test(mq);
}

function sortMediaQueries(a, b) {

    let A = a.replace(/\D/g, '');

    let B = b.replace(/\D/g, '');

    if (isMax(a) && isMax(b)) {

        return B - A;

    } else if (isMin(a) && isMin(b)) {

        return A - B;

    } else if (isMax(a) && isMin(b)) {

        return 1;

    } else if (isMin(a) && isMax(b)) {

        return -1;

    }

    return 1;

}