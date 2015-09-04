'use strict';

define([
    'q',
    'src/H2/Session',
    'src/H2/Service/Login'
], function (Q, Session, LoginService) {

    module('H2/Service/Login');

    asyncTest('sessionIsAuthenticated() is true with a valid session ID', 1, function () {
        var loginService = new LoginService({});
        loginService.readSession = function () {
            return Q(new Session({id: 'id'}));
        };
        loginService
            .sessionIsAuthenticated('session ID')
            .then(function (isAuthenticated) { ok(isAuthenticated); })
            .finally(start)
            .done();
    });

    asyncTest('sessionIsAuthenticated() is false without a session ID', function () {
        new LoginService({})
            .sessionIsAuthenticated(Session.createAnonymous())
            .then(function (itAuthenticated) {
                ok(!itAuthenticated);
                start();
            });
    });
});
