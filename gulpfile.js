const {src, dest, series, parallel, watch} = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');

const htmlmin = require('gulp-htmlmin');

const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');

const babel = require('gulp-babel');

const origin = 'src';
const destination = 'dist';

const concat = require('gulp-concat');
                                                      
sass.compiler = require('node-sass');

async function clean(cb){
   await del(destination);
    cb();
}

function html(cb) {
    src(`${origin}/**/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))    
    .pipe(dest(destination));
    cb();
}

function images(cb) {
    src(`${origin}/images/*`)
    .pipe(imagemin())
    .pipe(dest(`${destination}/images`));
    cb();
}

function css(cb) {
    src(`${origin}/css/style.scss`)
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(dest(`${destination}/css`));
    cb();
}

function js(cb) {
    src(`${origin}/js/*.js`)
    .pipe(babel({
        presets:['@babel/env']
    }))
    .pipe(concat('script.js'))
    .pipe(dest(`${destination}/js`));
    cb();
}


function fonts(cb) {
    src(`${origin}/fonts/*`)
    .pipe(dest(`${destination}/fonts`));
    cb();
}

function watcher(cb) {
    watch(`${origin}/**/*.html`).on('change', series(html, browserSync.reload))
    watch(`${origin}/**/*.scss`).on('change', series(css, browserSync.reload))
    watch(`${origin}/**/*.js`).on('change', series(js, browserSync.reload))
    watch(`${origin}/images/*`).on('change', series(images, browserSync.reload))
    cb();
}

function server(cb){
browserSync.init({
    notify: false,
    open: false,
    server: {
        baseDir: destination
    }
})
    cb();
}

exports.default = series(clean, parallel(html, css, js), fonts, images, server, watcher);