'use strict';

const gaTrackerSnippet = require('.');
const test = require('tape');

test('gaTrackerSnippet', t => {
	t.equal(
		gaTrackerSnippet(),
		'ga(\'create\', \'UA-XXXXX-X\', \'auto\');\nga(\'send\', \'pageview\');',
		'should create a Google Analytics string with 6 parameters by default.'
	);

	t.equal(
		gaTrackerSnippet({id: 'UA-36461297-9'}),
		'ga(\'create\', \'UA-36461297-9\', \'auto\');\nga(\'send\', \'pageview\');',
		'should change web property ID using `id` option.'
	);

	t.equal(
		gaTrackerSnippet({id: '36461297-3'}),
		'ga(\'create\', \'UA-36461297-3\', \'auto\');\nga(\'send\', \'pageview\');',
		'should add UA- prefix to web property ID automatically.'
	);

	t.equal(
		gaTrackerSnippet({domain: 'foo.example.com'}),
		'ga(\'create\', \'UA-XXXXX-X\', \'foo.example.com\');\nga(\'send\', \'pageview\');',
		'should change domain using `domain` option.'
	);

	t.equal(
		gaTrackerSnippet({globalName: 'foo'}),
		'foo(\'create\', \'UA-XXXXX-X\', \'auto\');\nfoo(\'send\', \'pageview\');',
		'should change the global variable name using `globalName` option.'
	);

	t.equal(
		gaTrackerSnippet({minify: true, singleQuotes: true}),
		'ga(\'create\',\'UA-XXXXX-X\',\'auto\');ga(\'send\',\'pageview\');',
		'should remove whitespaces using `minify` option.'
	);

	t.equal(
		gaTrackerSnippet({singleQuotes: false, domain: null, id: null}),
		'ga("create", "UA-XXXXX-X", "auto");\nga("send", "pageview");',
		'should use double quotes when `singleQuotes` option is disabled.'
	);

	t.equal(
		gaTrackerSnippet('UA-36461297-9', 'foo.example.com'),
		'ga(\'create\', \'UA-36461297-9\', \'foo.example.com\');\nga(\'send\', \'pageview\');',
		'should accept two strings instead of an option.'
	);

	t.equal(
		gaTrackerSnippet('36461297-9'),
		'ga(\'create\', \'UA-36461297-9\', \'auto\');\nga(\'send\', \'pageview\');',
		'should accept a single string instead of an option.'
	);

	t.throws(
		() => gaTrackerSnippet({id: 1}),
		/TypeError.*1 is not a string\. id property must be a string\./,
		'should fail when `id` option is not a string.'
	);

	t.throws(
		() => gaTrackerSnippet({domain: ['foo']}),
		/TypeError.*domain property must be a string\./,
		'should fail when `domain` option is not a string.'
	);

	t.throws(
		() => gaTrackerSnippet({globalName: true}),
		/TypeError.*true is not a string\. globalName property must be a string\./,
		'should fail when `globalName` option is not a string.'
	);

	t.throws(
		() => gaTrackerSnippet({globalName: '12a'}),
		/Error.*12a cannot be used as a global variable name\./,
		'should fail when `globalName` option cannot be a variable name.'
	);

	t.end();
});
