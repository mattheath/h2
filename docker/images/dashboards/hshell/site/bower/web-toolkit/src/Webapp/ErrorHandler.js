'use strict';

define(function() {

    /**
     * @param {Window} windowAdapter
     * @param {function} listener
     */
    var addErrorListener = function(windowAdapter, listener) {
        // See http://devdocs.io/dom/globaleventhandlers.onerror. We don't use
        // addEventListener('error') as it's useless in Firefox.
        var originalListener = windowAdapter.onerror;
        windowAdapter.onerror = function() {
            var onErrorArguments = arguments;
            var listeners = [];
            if (originalListener) listeners.push(originalListener);
            listeners.push(listener);
            return listeners
                .map(function(listener) { return listener.apply(null, onErrorArguments); })
                .some(function(preventDefaultHandler) { return preventDefaultHandler; });
        };
    };

    /**
     * @param {Object} params
     * @param {H2/Webapp/GoogleAnalytics} [params.googleAnalytics]
     * @param {H2/CallAPI} [params.api]
     * @param {Window} [params.window]
     */
    return function(params) {

        params.window = params.window || window;

        addErrorListener(params.window, function(message, file, line, column, error) {

            // These arguments are being passed by all the browsers
            var data = {message: message, file: file, line: line};

            // HTML5 browsers pass these extra arguments
            if (error) {
                data.column = column;
                if (error.message) data.message = error.message;
                data.stack = error.stack;
            }

            // Common properties
            data.url = String(location);
            data.userAgent = navigator.userAgent;
            data.date = new Date;

            if (params.api) {
                var session = params.api.getSession();
                if (session.isAuthenticated()) data.username = session.getUsername();
            }

            if (params.googleAnalytics) {
                params.googleAnalytics.track('send', {
                    hitType: 'event',
                    eventCategory: 'Javascript',
                    eventAction: data.message,
                    eventLabel: JSON.stringify(data, null, 2)
                });
            }

            if (params.api) {
                params.api
                    .call('com.hailocab.service.web-events', 'log', {
                        level: 'error',
                        data: JSON.stringify(data)
                    }).catch(function(error) {
                        console.log("Couldn't log error (" + error.message + ")");
                    });
            }
        });
    };
});
