// To create public folder structure => run 'gulp directories' first.

// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require("gulp");
// Importing all the Gulp-related packages we want to use
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const replace = require("gulp-replace");
const bsync = require("browser-sync").create(); // create a browser-sync instance...

// File paths
const baseSourcePath = "src/";
const sourcePaths = {
  css: baseSourcePath + "css/**/*.scss",
  js: baseSourcePath + "js/**/*.js",
  html: baseSourcePath + "**/*.html"
};

const cssSourceOrder = [
  baseSourcePath + "css/globals.scss",
  baseSourcePath + "css/layouts.scss",
  baseSourcePath + "css/style.scss",
  baseSourcePath + "css/**/*.scss"
];

function addjQuery() {
  return src("node_modules/jquery/dist/jquery.slim.min.js").pipe(
    dest("public/dist/js/")
  );
}

// Sass task: compiles the style.scss file into style.css
function scssTask() {
  return src(cssSourceOrder)
    .pipe(sourcemaps.init({ loadMaps: true, largFile: true })) // initialize sourcemaps first
    .pipe(concat("style.min.css"))
    .pipe(sass().on("error", sass.logError)) // compile SCSS to CSS
    .pipe(postcss([autoprefixer("last 2 versions"), cssnano()])) // PostCSS plugins
    .pipe(sourcemaps.write(".")) // write sourcemaps file in current directory
    .pipe(dest("public/dist/css")); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
  return src(sourcePaths.js)
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(dest("public/dist/js"));
}

// Cachebust
var cbString = new Date().getTime();

function cacheBustTask() {
  return src(sourcePaths.html)
    .pipe(replace(/cb=\d+/g, "cb=" + cbString))
    .pipe(dest("public/dist"))
    .pipe(bsync.reload({ stream: true }));
}

function browSync(done) {
  bsync.init({
    server: {
      baseDir: "./public/dist/",
      directory: true
    }
  });

  done();
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask() {
  watch(
    [sourcePaths.css, sourcePaths.js, sourcePaths.html],
    series(parallel(scssTask, jsTask), cacheBustTask)
  );
  watch([sourcePaths.css, sourcePaths.js, sourcePaths.html]).on(
    "change",
    bsync.reload
  );
}

// Crates default folder/scaffolding structure
function directories() {
  return src("*.*", { read: false })
    .pipe(dest("./public"))
    .pipe(dest("./public/dist"))
    .pipe(dest("./public/dist/css"))
    .pipe(dest("./public/dist/js"))
    .pipe(dest("./public/dist/img"))
    .pipe(dest("./src/css"))
    .pipe(cacheBustTask());
}

exports.default = series(
  browSync,
  parallel(scssTask, jsTask),
  addjQuery,
  cacheBustTask,
  watchTask
);

exports.directories = series(directories);
