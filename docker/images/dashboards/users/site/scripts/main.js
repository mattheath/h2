'use strict';

// Notify the user of any unhandled error
window.onerror = function(message, file, line, column, error) {
    alert(error && error.message || message);
};

// Set some shortcuts to our third party dependencies. Entries marked
// with WT are required by Web Toolkit.
require.config({
    paths: {
        jquery: '../bower/jquery/jquery', // WT
        uri: '../bower/uri.js/src', // WT
        q: '../bower/q/q', // WT
        underscore: '../bower/underscore/underscore',
        backbone: '../bower/backbone/backbone',
        text: '../bower/requirejs-text/text',
        'web-toolkit': '../bower/web-toolkit/src',
        moment: '../bower/moment/moment',
        datetimepicker: '../bower/datetimepicker/jquery.datetimepicker',
        templates: '../templates',
        toastr: '../bower/toastr/toastr'
    },
    shim: {
        underscore: {
            deps: [
                'jquery'
            ],
            exports: '_'
        },
        datetimepicker: {
            deps: [
                'jquery'
            ],
            exports: 'datetimepicker'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        }
    }
});

require(['./App', 'web-toolkit/Webapp'], function (App, Webapp) {
    new Webapp()
        .ready
        .then(function(webapp) {
            // make sure user is at least signed in
            webapp.loginWebapp.login()
                .then(function() {
                    new App(webapp);
                })
                .done();
        })
        .done();
});
