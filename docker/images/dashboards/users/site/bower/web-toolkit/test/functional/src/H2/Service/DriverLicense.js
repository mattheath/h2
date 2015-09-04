'use strict';

define([
    'src/H2/Service/DriverLicense',
    'test/functional/util'
], function(Service, util) {

    module('H2/Service/DriverLicense');

    asyncTest('search()', 1, function() {
        util.createAuthenticatedAPI({userType: 'admin'})
            .then(function(api) {
                return new Service(api).search({hob: 'ATL'}).then(function(response) {
                    ok(response.licenses instanceof Array);
                });
            })
            .finally(start)
            .done();
    });
});
