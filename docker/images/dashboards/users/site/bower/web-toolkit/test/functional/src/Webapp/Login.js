'use strict';

define([
    'src/H2/Session',
    'src/Webapp/Login',
    'test/functional/util'
], function(Session, LoginWebapp, util) {

    module('Webapp/Login');

    asyncTest('login() fulfills when the user gets authenticated', 0, function() {
        var api = util.createAPI();
        new LoginWebapp(api).login().then(start).done();
        util.login(api).done();
    });

    asyncTest('login() fulfills when the user is already authenticated', 0, function() {
        util.createAuthenticatedAPI()
            .then(function(api) { return new LoginWebapp(api).login(); })
            .done(start, start);
    });

    // Sometimes the session details we have are out of date (e.g. because the session
    // has been removed in the backend)
    asyncTest('On authentication error, logging in is forced', 0, function() {
        var api = util.createAPI();
        var webapp = new LoginWebapp(api);
        webapp.handleSession();
        api.setSession(Session.createAuthenticated({id: 'id'}));
        webapp.overlay.on('shown', function() {
            webapp.overlay.hide();
            start();
        });
        // Trigger a request that will fail
        api.call('com.hailocab.kernel.discovery', 'services').done();
    });
});
