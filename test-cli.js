/* jshint unused:true */
'use strict';

var exec = require('child_process').exec;

var eachExec = require('each-exec');
var test = require('tape');

var pkg = require('./package.json');
var bin = 'node ' + pkg.bin + ' ';

test('"' + pkg.name + '" command', function(t) {
  t.plan(14);

  exec(bin, function(err, stdout, stderr) {
    t.strictEqual(err, null, 'should not fail by default.');
    t.strictEqual(
      stdout,
      'ga(\'create\', \'UA-XXXXX-X\', \'auto\');\n' +
      'ga(\'send\', \'pageview\');\n',
      'should print default value to stdout when it takes no options.'
    );
    t.strictEqual(stderr, '', 'should print no value to stderr.');
  });

  eachExec([
    bin + '--id 36461297-9 --domain foo.example.com --global a --double --minify',
    bin + '-i UA-36461297-9 -d foo.example.com -g a -w -m'
  ], function(err, stdouts) {
    t.strictEqual(err, null, 'should accept options.');
    t.strictEqual(
      stdouts[0],
      'a("create","UA-36461297-9","foo.example.com");a("send","pageview");\n',
      'should reflect options to the output.'
    );
    t.equal(stdouts[0], stdouts[1], 'should accept aliases of the options.');
  });

  eachExec([bin + '--version', bin + '-v'], function(err, stdouts) {
    t.strictEqual(err, null, 'should accept -v or --version flag.');
    t.equal(
      stdouts[0], pkg.version + '\n',
      'should print version using --version flag.'
    );
    t.equal(
      stdouts[0], stdouts[1],
      'should use -v as an alias of --version.'
    );
  });

  eachExec([bin + '--help', bin + '-h'], function(err, stdouts) {
    t.strictEqual(err, null, 'should accept --help or -h flag.');
    t.ok(
      /Usage/.test(stdouts[0]),
      'should print usage information using --version flag.'
    );
    t.equal(
      stdouts[0], stdouts[1],
      'should use -h as an alias of --help.'
    );
  });

  exec(bin + '--global 1', function(err, stdout, stderr) {
    t.equal(
      err.code, 1,
      'should fail when --global option takes invalid argument.'
    );
    t.equal(
      stderr, '1 cannot be used as a global variable name.\n',
      'should print error message when it fails.'
    );
  });
});
