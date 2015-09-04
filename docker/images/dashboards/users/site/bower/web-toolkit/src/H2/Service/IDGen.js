'use strict';

define(function() {

    /**
     * Interface to the https://github.com/hailocab/id-gen
     *
     * @param {H2/CallAPI} api
     */
    var Service = function(api) {
        this._api = api;
    };

    /**
     * @returns {Promise} {id: <string>} A unique number that is bigger than the
     *     previous generated one.
     */
    Service.prototype.cruftflake = function() {
        return this._api.call('com.hailocab.service.idgen', 'cruftflake')
            .then(function(response) {
                response.id = String(response.id); // Most of the services expect IDs to be strings
                return response;
            });
    };

    Service.prototype.uuid = function() {
        return this._api.call('com.hailocab.service.idgen', 'uuid');
    };

    return Service;
});
