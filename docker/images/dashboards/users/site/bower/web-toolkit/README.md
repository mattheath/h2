# Hailo Web Toolkit 4 (in development)

Common JS library used across all our webapps. All logic potentially useful in more than one webapp should go here.

## Adding it to your project with Bower

In your `bower.json`:

```js
{
    "dependencies": {
        "web-toolkit": "git@github.com:hailocab/web-toolkit.git#4"
    }
}
```

## Using it with RequireJS

```js
require.config({
    paths: {
        jquery: '.../bower_components/jquery/jquery',
        q: '.../bower_components/q/q',
        uri: '.../bower_components/uri.js/src'
    }
});
```

then you can do

```js
require(['toolkit/H2/CallAPI'], function(API) {
});
```

## Using it standalone

In your 'bower.json':

```js
{
    "dependencies": {
        // ...
        "web-toolkit": "git@github.com:hailocab/web-toolkit.git#dist"
    }
}
```

then you can do

```html
<script src=".../jquery/jquery.js"></script>
<script src=".../q/q.js"></script>
<script src=".../uri.js/src/URI.js"></script>
<script src="bower_components/web-toolkit/4/toolkit.js"></script>
<script>var Api = require('toolkit/H2/CallAPI');</script>
```

## Development

```bash
$ git submodule update --init
$ common/script/web/setup
```

## Testing

```bash
$ grunt test # or
$ grunt test:unit # for unit tests only, or
$ grunt test:func # for functional ones
```

or in the browser by opening:

- test/unit.html
- test/functional.html

If you get PhantomJS timeouts errors it means that the test user doesn't exist (or expired).
Follow these instructions
https://github.com/hailocab/web-toolkit/blob/4/test/functional/util.js to fix it.

## Changelog

### 2014-05-06

  Use only secure cookie.

### 2014-04-01

- `Webapp/Login#login()` doesn't accept (nor require) a `force` parameter anymore.

### 2014-03-28

- `Elasticride` requires an environment name instead of an API URL.
- `Config.getEnvironment()` has been removed. Use `Environment.fromApiUrl()`

### 2014-03-26

- `H2/Service/WebEvents` has been removed.
- `Webapp/ErrorHandler` doesn't accept a `H2/Service/WebEvents` or a
  `windowAdapter` anymore.

### 2014-02-20

- `H2/Session/CookieStorage` is now using the secure cookie flag, thus you'll have to use HTTPS:
  - Bump your grunt-contrib-connect version to 0.6.0 (in package.json)
  - In connect options (in Gruntfile.js) add `protocol: "https"`
  - Use https://your-test-url...

Check https://github.com/hailocab/web-toolkit/tree/3#changelog for the changes in the previous version.
