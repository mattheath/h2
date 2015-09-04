'use strict';

define([
    'src/H2/Service/Zoning',
    'src/Warning',
    'test/functional/util'
], function(Service, Warning, util) {

    module('H2/Service/Zoning');

    asyncTest("save() creates and updates a zone, read() reads it, and delete() removes it", function() {
        util.createAuthenticatedAPI({userType: 'admin'}).then(function(api) {
            var service = new Service(api);
            service
                .save({
                    name: 'Test zone',
                    tags: ['atl', 'test']
                })
                .then(function(zoneId) {
                    return service.save({
                        id: zoneId,
                        description: 'Updated'
                    });
                })
                .then(function(zoneId) { 
                    return service.read({id: zoneId}).catch(Warning.thenIgnore); 
                })
                .then(function(response) {
                    var zone = response.zone[0];
                    ok(zone.name, 'Test zone');
                    ok(zone.description, 'Updated');
                    return service.delete({id: zone.id})
                        .then(function() { return zone; });
                })
                .then(function(zone) { 
                    return service.read({id: zone.id})
                        .then(function(response) { ok(!response.zone.length); }); 
                })
                .finally(start)
                .done();
        });
    });
});
