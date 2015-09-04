'use strict';

define([
    'q',
    'src/H2/Service/Profile'
], function(Q, Service) {

    module('H2/Service/Profile');

    asyncTest('getSchemas()', function() {
        var api = {
            call: function() {
                return Q({
                    schema: {
                        fields: []
                    }
                });
            }
        };
        new Service(api).getSchemas(['a'])
            .then(function(schemas) { ok(schemas.a instanceof Object); })
            .finally(start)
            .done();
    });
});
