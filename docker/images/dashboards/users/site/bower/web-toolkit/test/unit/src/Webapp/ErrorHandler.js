'use strict';

define([
    'q',
    'src/H2/CallAPI',
    'src/Webapp/ErrorHandler'
], function(Q, Api, ErrorHandler) {

    module('Webapp/ErrorHandler');

    asyncTest('It logs unhandled errors', 2, function() {
        var windowAdapter = {};
        var api = new Api('url');
        api.call = function() {
            start();
            return Q();
        };
        new ErrorHandler({
            api: api,
            googleAnalytics: {
                track: function(action, params) {
                    equal(action, 'send');
                    equal(params.hitType, 'event');
                }
            },
            window: windowAdapter
        });
        windowAdapter.onerror('message', 'file', 0);
    });
});
