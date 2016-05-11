var gulp = require('gulp'),
    browsersync = require('browser-sync'),
    newer = require('gulp-newer');

// file locations
var source = 'app/',
    dest = 'build/';

var scss = {
    in: source + "styles/**/*.scss",
    sassOpts: {
        outputStyle: 'nested',
        precision: 3,
        errLogToConsole: true
    },
    out: dest + '/styles'
};


var sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css');

// compile Sass
gulp.task('sass', function () {

    gulp.src(scss.in)
        .pipe(sass(scss.sassOpts))
        .pipe(gulp.dest(source + "styles/"));

    return gulp.src(scss.in)
        .pipe(sass(scss.sassOpts))
        .pipe(minifyCSS())
        .pipe(gulp.dest(scss.out))
        .pipe(browsersync.reload({stream: true}));
});

//css
var css = {
    in: source + "styles/vendor/**/*.*",
    out: dest + '/styles/vendor'
}

gulp.task('css', function() {
    return gulp.src(css.in)
        .pipe(newer(css.out))
        .pipe(gulp.dest(css.out))
        .pipe(browsersync.reload({ stream: true }));
});

var uglify = require('gulp-uglify');
var del = require('del');

//minify js
var js = {
    in: source + 'scripts/**/*.js',
    map: source + 'scripts/**/*.map',
    out: dest + 'scripts/'
};

gulp.task('minify-js',function(){

    del([
        js.dest + '*'
    ]);

    gulp.src(js.map)
        .pipe(gulp.dest(js.out));

    return gulp.src(js.in)
        .pipe(uglify())
        .pipe(gulp.dest(js.out));

});

//this is used to minify HTML without changing its structure
var htmlclean = require('gulp-htmlclean');
var html = {
    in: source + "**/*.html"
};

var views ={
	in: source + "/views/**/*.*",
	dest: dest + "/views"
}


// minify html
gulp.task('html', function () {
	
	 gulp.src(views.in)
		 .pipe(htmlclean())
		 .pipe(gulp.dest(views.dest));
		 
    return gulp.src(html.in)
        .pipe(htmlclean())
        .pipe(gulp.dest(dest));

});

//json
var json = {
    in: 'json/*.json'
};

gulp.task('json', function () {
    return gulp.src(json.in)
        .pipe(gulp.dest('json'));

});

//minimise images
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');


var images = {
    in:source + "/images/**/*.*",
    dest: dest + "/images"
};



gulp.task('image-min',function(){
    console.log('start image - min');
    return gulp.src(images.in)
        .pipe(newer(images.dest))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(images.dest));
});


//this task will reload a browser using browser-sync
var syncOpts = {
    server: {
        baseDir: dest,
        index: 'index.html'
    },
    open: false,
    notify: true
};

//test
var test = 'test/spec/';
var karma = require('gulp-karma');
var testFiles = test + '**/*.js';

gulp.task('test', function() {
    // Be sure to return the stream
    return gulp.src('./foobar')
        .pipe(karma({
            configFile: 'test/karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            console.log(err);
            this.emit('end');
        });
});

//browser sync
gulp.task('browsersync', function () {
    browsersync(syncOpts);
});

gulp.task('browsersync-reload', function (){
    browsersync.reload();
});

// watch tasks
gulp.task('run', ['html','sass', 'css', 'browsersync','minify-js','image-min','test','json'], function() {

    gulp.watch([html.in, scss.in,js.in,views.in],['browsersync-reload']);

    gulp.watch([html.in,views.in], ['html']);

    gulp.watch(scss.in, ['sass']);

    gulp.watch(css.in, ['css']);

    gulp.watch(js.in,['minify-js']);

    gulp.watch(images.in,['image-min']);

    gulp.watch([js.in,testFiles],['test']);

    gulp.watch(json.in,['json']);


});