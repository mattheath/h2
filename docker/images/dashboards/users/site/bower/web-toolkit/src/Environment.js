'use strict';

define(['uri/URI'], function (Uri) {

    /**
     * Represents one of our environments:
     *
     * - 'live' (refered as 'production' in certain places)
     * - 'staging'
     * - 'test' (refered as 'testing' and 'development' in certain places)
     * - Any other custom one (like 'CITYR-123' or 'barty')
     *
     * The main point of this object is to normalise the different names we are
     * using to refer the same environments. When possible, avoid using it and
     * just stick to the convention.
     *
     * @deprecated Ideally at some point we won't need it anymore.
     *
     * @param {string} environment The name of the environment
     */
    var Environment = function (environment) {
        this._environment = environment;
    };

    /**
     * @param {string} url
     * @returns {Environment}
     */
    Environment.fromApiUrl = function (url) {
        return new this((function () {
            var host = new Uri(url).normalize().hostname();
            if (host.match('live') || host.match('lve') || host == 'api2.elasticride.com') return 'lve';
            if (host.match('stg')) return 'stg';
            if (host.match('tst')) return 'tst';
        })());
    };

    /**
     * @returns {string|falsy} The name of the environment or a falsy value if unknown.
     *
     * Names for standard environments are 'live', 'staging' and 'test'.
     */
    Environment.prototype.toString = function () {
        return this._environment;
    };

    /**
     * @returns {string|falsy} The name of the environment in Elasticride or a
     *     falsy value if unknown.
     */
    Environment.prototype.toElasticride = function () {
        if (this._environment == 'lve') return 'production';
        if (this._environment == 'stg') return 'staging';
        if (this._environment == 'tst') return 'development';
    };

    return Environment;
});
