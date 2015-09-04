'use strict';

define([
    'src/H2/CallAPI/Error',
    'test/functional/util',
    'src/H2/Session'
], function(Error, util, Session) {

    module('H2/CallAPI/Error');

    asyncTest('isUnauthenticated() is false with existent sessions', 1, function() {
        util.createAuthenticatedAPI()
            .then(function(api) {
                return api.call('com.hailocab.service.experiment', 'create')
                    .catch(function(error) { ok(!error.isUnauthenticated()); });
            })
            .finally(start)
            .done();
    });

    asyncTest('isUnauthenticated() is false with a non access denied error', 1, function() {
        var api = util.createAPI();
        api.call('com.hailocab.service.login', 'readsession', {sessId: 'whatever'})
            .catch(function(error) { ok(!error.isUnauthenticated()); })
            .finally(start)
            .done();
    });

    asyncTest('isUnauthenticated() is true with nonexistent sessions', 1, function() {
        var api = util.createAPI();
        api.setSession(Session.createAuthenticated({
            id: "doesn't exist",
            username: 'barty'
        }));
        api.call('com.hailocab.kernel.discovery', 'services')
            .catch(function(error) { ok(error.isUnauthenticated()); })
            .finally(start)
            .done();
    });
});
