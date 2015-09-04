'use strict';

define(['jquery', 'q'], function($, Q) {

    var defaultConfig = {
        'environment': {
            'h2APIBaseURL': 'https://api2-tst.elasticride.com',
            'environment':  'tst'
        },
        'config': {}
    };

    /**
     * Webapp configuration loaded from the server
     *
     * @returns {Promise} An object with the config properties
     */
    return function() {
        // HailoConfig is the global config object
        if (typeof HailoConfig != 'undefined') {
            return Q.fcall(function() {
                return HailoConfig;
            });
        }

        // otherwise, load config JSON files
        return Q($.when($.getJSON('/environment.json'), $.getJSON('/config.json'))
            .then(function(env, cfg) {
                return {
                    'environment': env[0],
                    'config':      cfg[0]
                };
            }))
            .catch(function(xhr) {
                if (xhr.status == 404) return defaultConfig;
                throw new Error(xhr.status);
            });
    };
});
