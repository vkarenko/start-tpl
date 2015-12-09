'use strict';
 
var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	size = require('gulp-size'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	rimraf = require('rimraf'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload;

var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/gfx/'
	},
	src: {
		html: 'src/*.html',
		js: 'src/js/main.js',
		style: 'src/scss/main.scss',
		img: 'src/gfx/**/*.*'
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/scss/**/*.scss',
		img: 'src/gfx/**/*.*'
	},
	clean: './build'
};

// Browser Sync 
gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: './build'
		},
		online: true,
		files: './build/css/**/*.css',
		browser: ['d:/install/chrome-win32/chrome.exe'],
		open: 'ui',
		tunnel: 'vkarenko',
		host: 'localhost',
		port: 8080,
		logPrefix: 'grid-en'
	});
});

gulp.task('clean', function(cb) {
	rimraf(path.clean, cb);
});

gulp.task('html:build', function() {
	gulp.src(path.src.html)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(size({
			showFiles: true
		}))
		.pipe(reload({stream: true}));
});

gulp.task('js:build', function() {
	gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(size({
			showFiles: true
		}))
		.pipe(reload({stream: true}));
});

gulp.task('style:build', function() {
	gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			sourceMap: true,
			errLogToConsole: true
		}))
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(sourcemaps.write('../maps'))
		.pipe(size({
			showFiles: true
		}))
		.pipe(gulp.dest(path.build.css));
});

gulp.task('image:build', function() {
	gulp.src(path.src.img)
		.pipe(plumber())
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(size({
			showFiles: true
		}))
		.pipe(reload({stream: true}));
});

gulp.task('build', [
	'html:build',
	'js:build',
	'style:build',
	'image:build'
]);

gulp.task('watch', function(){
	watch([path.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.watch.style], function(event, cb) {
		gulp.start('style:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
});

gulp.task('default', ['build', 'server', 'watch']);
