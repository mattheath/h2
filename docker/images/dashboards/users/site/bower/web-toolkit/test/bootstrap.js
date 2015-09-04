/* global QUnit */

"use strict";

QUnit.config.autostart = false; // We'll QUnit.start() after loading the RequireJS modules

window.require = {
    baseUrl: '..',
    urlArgs: Date.now(), // Bypass caches (useful when loading the page from the file system)
    paths: {
        jquery: "bower_components/jquery/jquery",
        q: 'bower_components/q/q',
        uri: 'bower_components/uri.js/src'
    },
    deps: ['q'],
    callback: function(Q) {
        // Avoid the confusing "Unhandled rejection reasons (should be empty)"
        // Pending to have it removed altogether https://github.com/kriskowal/q/pull/408
        Q.stopUnhandledRejectionTracking();
    }
};
