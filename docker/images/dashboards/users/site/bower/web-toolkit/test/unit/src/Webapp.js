'use strict';

define([
    'src/H2/CallAPI',
    'src/Webapp',
    'q'
], function(API, Webapp, Q) {

    module('Webapp');

    asyncTest('It uses api param', 1, function() {
        new Webapp({
                api: new API('url'),
                windowAdapter: {}
            })
            .ready
            .then(function(webapp) { equal(webapp.api.getBaseURL(), 'url'); })
            .finally(start)
            .done();
    });

    asyncTest('It uses config API', 1, function() {
        new Webapp({
                config: {
                    environment: {
                        h2APIBaseURL: 'url'
                    }
                },
                windowAdapter: {}
            })
            .ready
            .then(function(webapp) { equal(webapp.api.getBaseURL(), 'url'); })
            .finally(start)
            .done();
    });

    asyncTest("It fails when config can't be loaded", 1, function() {
        new Webapp({config: Q.fail()})
            .ready
            .catch(function() { ok(true); })
            .finally(start);
    });

    // It ensures backwards compatibility
    test('It bootstrap straightaway when an API is passed', function() {
        var api = new API('url');
        var webapp = new Webapp(api);
        ok(webapp.api);
    });

    asyncTest('Session handling is enabled by default', function() {
        new Webapp({api: new API('whatever')}).ready
            .then(function(webapp) {
                ok(webapp.loginWebapp);
                start();
            });
    });

    asyncTest('Session handling can be disabled', function() {
        new Webapp({api: new API('whatever'), handleSession: false}).ready
            .then(function(webapp) {
                ok(!webapp.loginWebapp);
                start();
            });
    });

    asyncTest('Config is always available', function() {
        new Webapp().config
            .then(function(config) { ok(config.environment.h2APIBaseURL); })
            .finally(start)
            .done();
    });
});
