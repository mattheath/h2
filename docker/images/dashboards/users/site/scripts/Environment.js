'use strict';

define(['web-toolkit/Environment'], function (WebToolkitEnvironment) {

    /**
     * The environment of an H2 API
     *
     * @param {web-toolkit/H2/CallAPI} api
     */
    var Environment = function(api) {
        this._api = api;
    };

    /**
     * @returns {string} A name for the environment
     */
    Environment.prototype.getName = function () {
        return this._getKnownName() || this._getHostname();
    };

    Environment.prototype._getKnownName = function () {
        return WebToolkitEnvironment
            .fromApiUrl(this._api.getBaseURL())
            .toString();
    };

    Environment.prototype._getHostname = function () {
        var a = document.createElement('a');
        a.href = this._api.getBaseURL();
        return a.hostname;
    };

    return Environment;
});
