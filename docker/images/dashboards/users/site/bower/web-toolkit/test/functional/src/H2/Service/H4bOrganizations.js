'use strict';

define([
    'q',
    'src/H2/Service/H4bOrganizations',
    'test/functional/util'
], function(Q, Service, util) {

    module('H2/Service/H4bOrganizations');

    asyncTest('list()', 1, function() {
        util.createAuthenticatedAPI({userType: 'admin'})
            .then(function(api) {
                return new Service(api)
                    .list({
                        start: '',
                        count: 5
                    })
                    .then(function(response) {
                        ok(response.result instanceof Array && response.result.length === 5);
                    });
            })
            .finally(start)
            .done();
    });

    asyncTest('listByAdmin()', 1, function() {
        util.createAuthenticatedAPI({userType: 'admin'})
            .then(function(api) {
                return new Service(api)
                    .listByAdmin({
                        count: 5,
                        adminId: 'qwerty'
                    })
                    .then(function(response) {
                        equal(response.total, 0);
                    });
            })
            .finally(start)
            .done();
    });

});
