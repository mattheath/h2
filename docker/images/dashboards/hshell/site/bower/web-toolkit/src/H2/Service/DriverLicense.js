'use strict';

define([], function() {

    var Service = function(api) {
        this._api = api;
    };

    /**
     * @param {Object} request
     * @return {Promise}
     */
    Service.prototype.search = function(request) {
        return this._api
            .call('com.hailocab.service.driver-license', 'search', request)
            .then(function(response) {
                response.licenses = response.licenses || [];
                return response;
            });
    };

    return Service;
});
