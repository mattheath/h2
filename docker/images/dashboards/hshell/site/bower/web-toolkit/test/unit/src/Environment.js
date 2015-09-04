'use strict';

define(['src/Environment'], function (Env) {

    module('Environment');

    test('fromApiUrl()', function () {
        equal(Env.fromApiUrl('https://api2.elasticride.com').toString(), 'live');
        equal(Env.fromApiUrl('https://api2-eu-west-1-live.elasticride.com').toString(), 'live');
        equal(Env.fromApiUrl('https://api2-staging.elasticride.com').toString(), 'staging');
        equal(Env.fromApiUrl('https://api2-tst.elasticride.com').toString(), 'tst');
        ok(!Env.fromApiUrl('https://localhost.elasticride.com').toString());
    });

    test('toElasticride()', function () {
        equal(new Env('live').toElasticride(), 'production');
        equal(new Env('stg').toElasticride(), 'staging');
        equal(new Env('tst').toElasticride(), 'development');
        ok(!new Env('foo').toElasticride());
    });
});
