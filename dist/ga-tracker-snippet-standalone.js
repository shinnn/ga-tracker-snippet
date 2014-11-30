!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.gaTrackerSnippet=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * ga-tracker-snippet | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/ga-tracker-snippet
*/

'use strict';

var isVarName = require('is-var-name');

module.exports = function gaTrackerSnippet(options) {
  if (typeof options === 'string') {
    options = {id: arguments[0], domain: arguments[1]};
  } else {
    options = options || {};
  }

  var templateData = {};

  var defultValues = {
    id: 'XXXXX-X',
    domain: 'auto',
    globalName: 'ga'
  };

  Object.keys(defultValues).forEach(function(key) {
    var prop = options[key];
    if (prop) {
      if (typeof prop !== 'string') {
        throw new TypeError(prop + ' is not a string. ' + key + ' property must be a string.');
      }
      templateData[key] = prop;
    } else {
      templateData[key] = defultValues[key];
    }
  });

  if (!isVarName(templateData.globalName)) {
    throw new Error(templateData.globalName + ' cannot be used as a global variable name.');
  }

  if (templateData.id.indexOf('UA-') === 0) {
    templateData.id = templateData.id.substring(3);
  }

  var space;
  if (options.minify) {
    space = '';
  } else {
    space = ' ';
  }

  var code = templateData.globalName +
             '(\'create\',' + space +
             '\'UA-' + templateData.id + '\',' + space +
             '\'' + templateData.domain + '\');' +
             (options.minify ? '' : '\n') +
             templateData.globalName +
             '(\'send\',' + space + '\'pageview\');';

  if (options.singleQuotes === false) {
    code = code.replace(/'/g, '"');
  }

  return code;
};

},{"is-var-name":2}],2:[function(require,module,exports){
/*!
 * is-var-name | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/is-var-name
*/

module.exports = function isVarName(str) {
  'use strict';

  if (typeof str !== 'string') {
    return false;
  }

  try {
    new Function('var ' + str)();
  } catch (e) {
    return false;
  }
  return true;
};

},{}]},{},[1])(1)
});