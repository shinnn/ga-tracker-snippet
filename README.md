# ga-tracker-snippet

[![npm version](https://img.shields.io/npm/v/ga-tracker-snippet.svg)](https://www.npmjs.com/package/ga-tracker-snippet)
[![Build Status](https://img.shields.io/travis/shinnn/ga-tracker-snippet.svg)](https://travis-ci.org/shinnn/ga-tracker-snippet)
[![Build status](https://ci.appveyor.com/api/projects/status/2t08amtmb6w4trjv?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/ga-tracker-snippet)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/ga-tracker-snippet.svg?label=cov)](https://coveralls.io/r/shinnn/ga-tracker-snippet)

Generate a code snippet to create a [Google Analytics](https://www.google.com/analytics/) tracker object

```javascript
gaTrackerSnippet({id: '36461297-9', domain: 'shinnn.github.io'});
```

yields:

```javascript
ga('create', 'UA-36461297-9', 'shinnn.github.io');
ga('send', 'pageview');
```

## Installation

Use npm.

```
npm install ga-tracker-snippet
```

## API

### gaTrackerSnippet([*options*])

*options*: `Object`  
Return: `string`

It returns a string of JavaScript code which creates a [tracker object of Google Universal Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#creation).

```javascript
gaTrackerSnippet(); //=> 'ga(\'create\', \'UA-XXXXX-X\', \'auto\');\nga(\'send\', \'pageview\');'
```

#### options.id

Type: `string`  
Default: `XXXXX-X`

Set web property ID. `UA-` prefix maybe omitted.

```javascript
gaTrackerSnippet({id: '36461297-9'}); //=> 'ga(\'create\', \'UA-36461297-9\', ... '

gaTrackerSnippet({id: 'UA-36461297-9'}) === gaTrackerSnippet({id: '36461297-9'}); //=> true
```

#### options.domain

Type: `string`  
Default: `auto`

Set domain of the site.

```javascript
gaTrackerSnippet({domain: 'foo.example.com'});
//=> 'ga(\'create\', \'UA-XXXXX-X\', \'foo.example.com\');\nga(\'send\', \'pageview\');'
```

#### options.globalName

Type: `string`  
Default: `ga`

Change the [global function name](https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#renaming).

```javascript
gaTrackerSnippet({globalName: '__tracker'});
//=> '__tracker(\'create\', \'UA-XXXXX-X\', \'auto\');\n__tracker(\'send\', \'pageview\');'
```

#### options.minify

Type: `boolean`  
Default: `false`

Omit whitespaces and newlines from the result.

#### options.singleQuotes

Type: `boolean`  
Default: `true`

`false` replaces all single quotes with double quotes.

### gaTrackerSnippet([*id*, *domain*])

A simple alias using two strings as its arguments instead of an object.

```javascript
gaTrackerSnippet('36461297-9', 'foo.example.com');
//=> 'ga(\'create\', \'UA-36461297-9\', \'foo.example.com\');\nga(\'send\', \'pageview\');'
```

## License

Copyright (c) 2014 - 2018 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
