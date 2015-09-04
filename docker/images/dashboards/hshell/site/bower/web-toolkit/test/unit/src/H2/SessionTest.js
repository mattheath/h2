'use strict';

define(['src/H2/Session'], function(Session) {

    module('H2/Session');

    test("An anonymous session doesn't have id, username or roles, and is not active", function() {
        var session = Session.createAnonymous();
        equal(session.getId(), null);
        equal(session.getUsername(), null);
        equal(session.isAuthenticated(), false);
        deepEqual(session.getRoles(), []);
    });
});
