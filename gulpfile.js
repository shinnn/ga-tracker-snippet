/*jshint unused:true */
'use strict';

var pkg = require('./package.json');

var path = require('path');
var spawn = require('child_process').spawn;

var $ = require('gulp-load-plugins')({config: pkg});
var browserify = require('browserify');
var gulp = require('gulp');
var mergeStream = require('merge-stream');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var stylish = require('jshint-stylish');
var tapSpec = require('tap-spec');

var bower = require('./bower.json');
var banner = require('tiny-npm-license')(pkg);

gulp.task('lint', function() {
  return mergeStream(
    gulp.src('{,test/}*.js')
      .pipe($.jscs(pkg.jscsConfig))
      .pipe($.jshint())
      .pipe($.jshint.reporter(stylish)),
    gulp.src('*.json')
      .pipe($.jsonlint())
      .pipe($.jsonlint.reporter())
  );
});

gulp.task('clean', rimraf.bind(null, 'dist'));

gulp.task('build', ['lint', 'clean'], function() {
  return mergeStream(
    gulp.src('index.js')
      .pipe($.replace(/^.+?require.+?\n\n/mg, ''))
      .pipe($.replace(banner + '\n', ''))
      .pipe($.replace(/isVarName/g, 'window.$&'))
      .pipe($.replace('module.exports', 'window.gaTrackerSnippet'))
      .pipe($.replace(/[\s\S]*/, banner + '!function() {\n$&\n}();\n'))
      .pipe($.rename(bower.main))
      .pipe(gulp.dest('')),
    browserify({
      entries: ['./index.js'],
      standalone: 'gaTrackerSnippet'
    })
      .bundle()
      .pipe(source(pkg.name))
      .pipe($.rename({suffix: '-standalone', extname: '.js'}))
      .pipe(gulp.dest(path.dirname(bower.main)))
  );
});

gulp.task('test', ['build'], function(cb) {
  var cp = spawn('node', ['node_modules/.bin/tape', 'test-*.js'], {
    stdio: [null, null, process.stderr]
  });
  cp.stdout.pipe(tapSpec()).pipe(process.stdout);
  cp.on('close', function(code) {
    cb(code ? new Error('Exited with code ' + code) : null);
  });
});

gulp.task('watch', function() {
  gulp.watch(['{,src/}*.js'], ['test']);
  gulp.watch(['*.json', '.jshintrc'], ['lint']);
});

gulp.task('default', ['test', 'watch']);
