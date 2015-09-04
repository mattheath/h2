'use strict';

define([
    'q',
    'src/H2/Service/Driver',
    'test/functional/util'
], function(Q, Service, util) {

    module('H2/Service/Driver');

    var getADriver = function(api) {
        return new Service(api).search().then(function(response) { 
            var driver = response.drivers[0]; 
            if (driver) return driver;
            throw new Error('No drivers found');
        });
    };

    asyncTest('search()', 1, function() {
        util.createAuthenticatedAPI({userType: 'admin'})
            .then(function(api) {
                return new Service(api)
                    .search()
                    .then(function(response) { ok(response.drivers instanceof Array); });
            })
            .finally(start)
            .done();
    });

    asyncTest('read()', 1, function() {
        util.createAuthenticatedAPI({userType: 'admin'})
            .then(function(api) {
                return getADriver(api).then(function(driver) {
                    return new Service(api)
                        .read(driver.id)
                        .then(function(response) { 
                            equal(response.driver.id, driver.id); 
                        });
                });
            })
            .finally(start)
            .done();
    });

    asyncTest('getMany()', 1, function() {
        util.createAuthenticatedAPI({userType: 'admin'})
            .then(function(api) {
                return getADriver(api).then(function(driver) {
                    return new Service(api)
                        .getMany([driver.id])
                        .then(function(drivers) { 
                            equal(drivers[0].id, driver.id); 
                        });
                });
            })
            .finally(start)
            .done();
    });
});
