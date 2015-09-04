'use strict';

define(['src/Webapp/Config'], function(Config) {

    module('Webapp/Config');

    asyncTest('A default config is provided as a fallback', function () {
        new Config().then(function (config) {
            equal(config.environment.h2APIBaseURL, 'https://api2-tst.elasticride.com');
            equal(config.environment.environment, 'tst');
            start();
        });
    });
});
