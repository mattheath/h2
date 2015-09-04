'use strict';

define([
    'test/functional/util',
    'src/H2/Service/IDGen'
], function(util, Service) {

    module('H2/Service/IDGen');

    asyncTest('cruftflake() returns a valid id', function() {
        new Service(util.createAPI())
            .cruftflake()
            .then(function(response) {
                ok(typeof response.id == 'string');
                ok(response.id.length);
                start();
            });
    });

    asyncTest('uuid() returns a valid id', function() {
        new Service(util.createAPI())
            .uuid()
            .then(function(response) {
                ok(typeof response.id == 'string');
                ok(response.id.length);
                start();
            });
    });
});
