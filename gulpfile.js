/*jshint unused:true */
'use strict';

var path = require('path');

var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var execSeries = require('exec-series');
var gulp = require('gulp');
var mergeStream = require('merge-stream');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var stylish = require('jshint-stylish');

var pkg = require('./package.json');
var bower = require('./bower.json');
var banner = require('tiny-npm-license')(pkg);

gulp.task('lint', function() {
  gulp.src(['{,test/}*.js'])
    .pipe($.jscs('package.json'))
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish));
  gulp.src('*.json')
    .pipe($.jsonlint())
    .pipe($.jsonlint.reporter());
});

gulp.task('clean', rimraf.bind(null, 'dist'));

gulp.task('build', ['lint', 'clean'], function() {
  return mergeStream(
    gulp.src('index.js')
      .pipe($.replace(/^.+?require.+?\n\n/mg, ''))
      .pipe($.replace(banner + '\n', ''))
      .pipe($.replace(/isVarName/g, 'window.$&'))
      .pipe($.replace('module.exports', 'window.gaTrackerSnippet'))
      .pipe($.wrap(banner + '!function() {\n<%= contents %>\n}();\n'))
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
  execSeries([
    'node test-api.js',
    'node test-cli.js'
  ], function(err, stdouts, stderrs) {
    process.stdout.write(stdouts.join(''));
    process.stderr.write(stderrs.join(''));
    cb(err);
  });
});

gulp.task('watch', function() {
  gulp.watch(['{,src/}*.js'], ['test']);
  gulp.watch(['*.json', '.jshintrc'], ['lint']);
});

gulp.task('default', ['test', 'watch']);
