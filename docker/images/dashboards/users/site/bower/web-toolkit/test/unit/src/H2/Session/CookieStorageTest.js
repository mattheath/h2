'use strict';

define([
    'src/H2/CallAPI',
    'src/H2/Session',
    'src/H2/Session/CookieStorage',
    'src/CookieMock'
], function(API, Session, CookieStorage, CookieMock) {

    module('H2/Session/CookieStorage');

    var objectsEqual = function(a, b) {
        return strictEqual(JSON.stringify(a), JSON.stringify(b));
    };

    test("It initialises correctly", function () {
        var api = new API('hostname');
        new CookieStorage(api, new CookieMock());
        objectsEqual(api.getSession()._properties, {});
    });

    test("It saves correctly", function() {
        var api = new API('hostname'),
            storage = new CookieStorage(api, new CookieMock()),
            params = {
                id: 'abc',
                username: 'Batman',
                expiryDate: new Date(Date.now() + 1 * 60 * 1000) // 1 hour from now
            };
        api.setSession(Session.createAuthenticated(params));
        objectsEqual(storage._getSession()._properties, params);
        strictEqual(storage._getSession().getId(), "abc");
        strictEqual(storage._getSession().getUsername(), "Batman");
    });

    test("It restores correctly", function() {
        var cookieMock = new CookieMock(),
            api,
            params;

        api = new API('hostname');
        new CookieStorage(api, cookieMock);

        params = {
            id: 'abc',
            username: 'barty',
            expiryDate: new Date(Date.now() + 1 * 60 * 1000) // 1 hour from now
        };
        api.setSession(Session.createAuthenticated(params));

        api = new API('hostname');
        new CookieStorage(api, cookieMock);

        objectsEqual(api.getSession()._properties, params);
    });
});