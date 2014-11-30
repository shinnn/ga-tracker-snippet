/* jshint unused:true */
'use strict';

var requireBowerFiles = require('require-bower-files');
var test = require('tape');

function runTest(description, main) {
  test(description, function(t) {
    t.plan(14);
    t.equal(main.name, 'gaTrackerSnippet', 'should have a function name.');

    t.equal(
      main(),
      'ga(\'create\', \'UA-XXXXX-X\', \'auto\');\nga(\'send\', \'pageview\');',
      'should create a Google Analytics string with 6 parameters by default.'
    );

    t.equal(
      main({id: 'UA-36461297-9'}),
      'ga(\'create\', \'UA-36461297-9\', \'auto\');\nga(\'send\', \'pageview\');',
      'should change web property ID using `id` option.'
    );

    t.equal(
      main({id: '36461297-3'}),
      'ga(\'create\', \'UA-36461297-3\', \'auto\');\nga(\'send\', \'pageview\');',
      'should add UA- prefix to web property ID automatically.'
    );

    t.equal(
      main({domain: 'foo.example.com'}),
      'ga(\'create\', \'UA-XXXXX-X\', \'foo.example.com\');\nga(\'send\', \'pageview\');',
      'should change domain using `domain` option.'
    );

    t.equal(
      main({globalName: 'foo'}),
      'foo(\'create\', \'UA-XXXXX-X\', \'auto\');\nfoo(\'send\', \'pageview\');',
      'should change the global variable name using `globalName` option.'
    );

    t.equal(
      main({minify: true, singleQuotes: true}),
      'ga(\'create\',\'UA-XXXXX-X\',\'auto\');ga(\'send\',\'pageview\');',
      'should change the global variable name using `globalName` option.'
    );

    t.equal(
      main({singleQuotes: false, domain: null, id: null}),
      'ga("create", "UA-XXXXX-X", "auto");\nga("send", "pageview");',
      'should use double quotes when `singleQuotes` option is disabled.'
    );

    t.equal(
      main('UA-36461297-9', 'foo.example.com'),
      'ga(\'create\', \'UA-36461297-9\', \'foo.example.com\');\nga(\'send\', \'pageview\');',
      'should accept two strings instead of an option.'
    );

    t.equal(
      main('36461297-9'),
      'ga(\'create\', \'UA-36461297-9\', \'auto\');\nga(\'send\', \'pageview\');',
      'should accept a single string instead of an option.'
    );

    t.throws(
      main.bind(null, {id: 1}),
      /TypeError.*1 is not a string\. id property must be a string\./,
      'should fail when `id` option is not a string.'
    );

    t.throws(
      main.bind(null, {domain: ['foo']}),
      /TypeError.*domain property must be a string\./,
      'should fail when `domain` option is not a string.'
    );

    t.throws(
      main.bind(null, {globalName: true}),
      /TypeError.*true is not a string\. globalName property must be a string\./,
      'should fail when `globalName` option is not a string.'
    );

    t.throws(
      main.bind(null, {globalName: '12a'}),
      /Error.*12a cannot be used as a global variable name\./,
      'should fail when `globalName` option cannot be a variable name.'
    );
  });
}

runTest('require(\'ga-tracker-snippet\')', require('./'));

global.window = {};
requireBowerFiles({self: true});

runTest('window.gaTrackerSnippet', window.gaTrackerSnippet);
