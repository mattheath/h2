"use strict";

define([
    "src/H2/CallAPI",
    'src/H2/CallAPI/Error',
    'test/functional/util'
], function (API, APIError, util) {

    module('H2/CallAPI');

    asyncTest("call() works with valid requests", 1, function() {
        util.createAuthenticatedAPI({userType: 'admin'})
            .then(function(api) {
                return api
                    .call("com.hailocab.kernel.discovery", "services")
                    .then(function(response) { ok(response.services); });
            })
            .finally(start)
            .done();
    });

    asyncTest("call() fails with unauthenticated requests", 3, function() {
        util.createAPI()
            .call("com.hailocab.kernel.discovery", "services")
            .catch(function(error) {
                ok(error instanceof APIError);
                ok(error.isAccessDenied());
                ok(error.isUnauthenticated());
            })
            .finally(start);
    });

    asyncTest('call() fails with forbidden requests', 3, function() {
        util.createAuthenticatedAPI()
            .then(function(api) {
                return api.call("com.hailocab.kernel.experiment", "save")
                    .catch(function(error) {
                        ok(error instanceof APIError);
                        ok(error.isAccessDenied());
                        ok(error.isForbidden());
                    });
            })
            .finally(start)
            .done();
    });

    asyncTest('changeSession, login and logout events are triggered', 3, function() {
        var api = util.createAPI();
        var changeSessionTriggered, loginTriggered, logoutTriggered;
        api.on('changeSession', function() { changeSessionTriggered = true; });
        api.on('login', function() { loginTriggered = true; });
        api.on('logout', function() { logoutTriggered = true; });
        util.login(api)
            .then(function() {
                api.setSession(null);
            })
            .then(function() {
                ok(changeSessionTriggered, "changeSession wasn't triggered");
                ok(loginTriggered, "login wasn't triggered");
                ok(logoutTriggered, "logout wasn't triggered");
            })
            .finally(start);
    });

    asyncTest("call() timeouts after a while", 0, function () {
        util.createAPI({_timeout: 1}).call('service', 'endpoint').catch(start);
    });
});
