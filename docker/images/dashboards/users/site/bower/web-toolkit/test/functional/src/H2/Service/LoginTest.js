"use strict";

define([
    'src/H2/Service/Login',
    'test/functional/util'
], function (LoginService, util) {

    module('H2/Service/Login');

    asyncTest("auth() works with good credentials", 1, function() {
        util.createAuthenticatedAPI()
            .then(function(api) { equal(api.getSession().getUsername(), util.username); })
            .finally(start);
    });

    asyncTest("auth() fails with bad credentials", 1, function() {
        new LoginService(util.createAPI())
            .auth('bad-username', 'bad-password')
            .catch(function(error) { equal(error.message, 'Invalid username/password'); })
            .finally(start);
    });

    asyncTest("logout() finishes session both in client and server", 1, function() {
        util.createAuthenticatedAPI()
            .then(function(api) {
                var loginService = new LoginService(api);
                var originalSession = api.getSession();
                return loginService.logout().then(function() {
                    ok(!api.getSession().isAuthenticated());
                    return loginService.readSession(originalSession).then(function() {
                        ok(false, "Session shouldn't exist");
                    });
                }); 
            })
            .finally(start);
    });
});
