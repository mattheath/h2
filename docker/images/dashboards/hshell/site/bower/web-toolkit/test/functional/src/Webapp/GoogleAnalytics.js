'use strict';

define(['src/Webapp/GoogleAnalytics'], function(Analytics) {

    module('Webapp/GoogleAnalytics');

    asyncTest('It tracks page changes', 0, function() {
        var analytics = new Analytics;
        analytics.once('sent', function() { // Initial page
            location.hash += 'x';
            analytics.once('sent', start); // Page change
        });
    });
});
