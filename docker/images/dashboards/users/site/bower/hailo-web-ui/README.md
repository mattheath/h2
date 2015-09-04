Hailo Web UI v2 _in development_
================================

**This is the current bleeding-edge version of the hailo-web-ui.**

## Goals of v2

- [X] Refactor to use 'src' directory
- [X] Use standard Gruntfile (same as web-template) 
- [X] Remove 'Pure CSS' dependency of 'h-portal' style

## What is this project?

A unified repository for Hailo styles, branding, logos and widgets.

## How do I use it?

### Add it to your project with bower

In `bower.json`:

```js
{
   "dependencies": {
        "hailo-web-ui": "git@github.com:hailocab/hailo-web-ui.git#2",
    }
}
```

Then run `bower install`.

### Use the SASS 

Now in SCSS, you can do something like:

```scss
$hImagesBaseUrl: "/bower/hailo-web-ui/src/img";
@import "../bower/hailo-web-ui/src/styles/pure-style/application";

```

## Using the JavaScript

### Hailo Maps

With require, you can use Hailo Maps:

```js
requirejs.config({
    baseUrl: "/scripts",
    paths: {
        underscore: "../bower/underscore/underscore",
        leaflet: "../bower/leaflet-dist/leaflet"
    },
    shim: {
        underscore: {
            exports: '_'
        }
    }
});
```

Then you can do:

```js
require([
    '../bower/hailo-web-ui/src/scripts/maps/map'
], function (Map) {
    var map = new Map({
        id: "hailo-map"
    });
    map.showWorld();
});
```

### Changes:
- Removed purecss, use h- instead pure- for forms and grids
- h-portal now only contains layout styles for h-header, h-sidebar, h-container. Visual styles for sidebar, header, and subcomponents are located in their own files.
- h-box mixin
- normalize is still used (can be pulled with bower)
- Base font-size: 62.5%, this means 1rem = 10px.
  Also body font-size is now 1.6rem (or em - doesn't matter for root definition)
- index.html is now using new layout
- Moved some separate demo pages to index.html
- Layout works in IE9+
- Reworked buttons. These should start as simple (no border styles) and be progressively enhanced.
- Button groups.
 

### To do:
- Hunt all (used and unused) globals down
- Refresh colors
- Wrap components with mixins so we can pass variables explicitly to them
- Remove pure-style folder (after carefully picking all we need from there)
- Add Modernizr classes to override slow 'translate' with 'translate3D' if detected
- Remove any !important declarations.
- Add more demo pages (modal, tabs, forms)

### Components wishlist:
- Button menus (in progress)
- Better grids (gutters, spacers, eg. http://neat.bourbon.io/examples/)
- Add stuff here..
