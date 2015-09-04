"use strict";

define([
    'src/H2/CallAPI',
    'src/H2/Session'
], function (API, Session) {

    module('H2/CallAPI');

    test("getUrl() doesn't include an inactive session", function () {
        var api = new API("hostname");
        strictEqual(api.getUrl("service", "endpoint"), "hostname/v2/h2/call?service/endpoint");
    });

    test("getUrl() includes an active session", function () {
        var api = new API("hostname");
        api.setSession(Session.createAuthenticated({id: 'id', username: 'barty'}));
        strictEqual(api.getUrl("service", "endpoint"), "hostname/v2/h2/call?service/endpoint&session_id=id");
    });

    asyncTest("addErrorHandler()", 1, function() {
        var api = new API("hostname");
        api.addErrorHandler(function() { throw "Error handled"; });
        api.addErrorHandler(function(error) { throw error + " twice"; });
        api.call()
            .catch(function(error) { equal(error, "Error handled twice"); })
            .finally(start);
    });

    asyncTest("it triggers 'logout' when the session is unauthenticated", 0, function() {
        var api = new API('hostname');
        api.once('logout', start);
        api.setSession(Session.createAnonymous());
    });

    asyncTest("it triggers 'logout' when the session expires", 0, function() {
        var api = new API('hostname');
        api.setSession(Session.createAuthenticated({
            id: 'id',
            expiryDate: new Date(Date.now() + 100)
        }));
        api.once('logout', start);
    });

    asyncTest("it triggers 'login' when a session replaces an expired one", 0, function() {
        var api = new API('hostname');
        api.setSession(Session.createAuthenticated({
            id: 'id',
            expiryDate: new Date(Date.now() + 50)
        }));
        api.once('logout', function() {
            api.once('login', start);
            api.setSession(Session.createAuthenticated({id: 'id'}));
        });
    });
});
