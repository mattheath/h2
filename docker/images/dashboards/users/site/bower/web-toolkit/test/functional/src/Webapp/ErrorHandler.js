'use strict';

define([
    'src/Webapp/ErrorHandler',
    'src/Webapp/GoogleAnalytics',
    'test/functional/util'
], function (ErrorHandler, Analytics, util) {

    module('Webapp/ErrorHandler');

    asyncTest("On error at least doesn't blow", 0, function () {
        var analytics = new Analytics;
        var windowAdapter = {};
        new ErrorHandler({
            api: util.createAPI(),
            googleAnalytics: analytics,
            window: windowAdapter
        });
        windowAdapter.onerror('message', 'file', 'line', 'column', new Error);
        analytics.once('sent', start);
    });
});
