'use strict';

define(['../../Webapp/Repository/Webapp', 'q'], function(Webapp, Q) {

    /**
     * @param {Object} r Search response from web-provisioning 
     * @return {Webapp} A webapps
     */
    var getWebapp = function(r) {
        return new Webapp({
            id      : r.id      || '',
            name    : r.name    || '',
            version : r.version || '',
            url     : r.url     || ''
        });
    };

    /**
     * @param {H2/CallAPI} api
     */
    var Service = function(api) {
        this._api = api;
    };

    /**
     * @return {Promise} An array of webapps
     */
    Service.prototype.search = function() {
        return this._api
            .call('com.hailocab.service.web-provisioning', 'search', {})
            .then(function(r) {
                return (r.results || []).map(function(result) {
                    return getWebapp(result);
                });
            });
    };

    /**
     * @param {string} id Webapp id
     * @return {Promise} A webapp, if found
     */
    Service.prototype.get = function(id) {
        return this._api
            .call('com.hailocab.service.web-provisioning', 'search', { 'name' : id })
            .then(function(r) {
                if (r.results && r.results.length > 0) {
                    return getWebapp(r.results[0]);
                }
                return Q.reject("Webapp not found");
            });
    };

    return Service;
});
