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
const files = {
  scssPath: "src/css/**/*.scss",
  jsPath: "src/js/**/*.js",
  htmlPath: "src/**/*.html"
};

function addjQuery() {
  return src("node_modules/jquery/dist/jquery.slim.min.js").pipe(
    dest("public/dist/js/")
  );
}

// Sass task: compiles the style.scss file into style.css
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass()) // compile SCSS to CSS
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
    .pipe(sourcemaps.write(".")) // write sourcemaps file in current directory
    .pipe(dest("public/dist/css")); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
  return src(files.jsPath)
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(dest("public/dist/js"));
}

// Cachebust
var cbString = new Date().getTime();

function cacheBustTask() {
  return src(["./src/index.html"])
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
    /*proxy: {
      target: "localhost:80",
      ws: true
    }*/
  });

  done();
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask() {
  watch(
    [files.scssPath, files.jsPath, files.htmlPath],
    series(parallel(scssTask, jsTask), cacheBustTask)
  );
  watch([files.scssPath, files.jsPath, files.htmlPath]).on(
    "change",
    bsync.reload
  );
}

// Crates default folder structure
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
