'use strict';

define([
    'src/H2/CallAPI',
    'src/Webapp/Repository',
    'src/Webapp/Repository/Webapp'
], function(Api, Repository, Webapp) {

    module("Webapp/Repository");

    asyncTest("getAll() returns the webapps", function() {
        var api = new Api('https://api2-tst.elasticride.com');
        new Repository(api)
            .getAll()
            .then(function(apps) {
                ok(apps instanceof Array);
                ok(apps.length);
                if (apps.length > 0) {
                    ok(apps[0] instanceof Webapp);
                }
            })
            .catch(function(error) { ok(false, error); })
            .finally(start);
    });
});
