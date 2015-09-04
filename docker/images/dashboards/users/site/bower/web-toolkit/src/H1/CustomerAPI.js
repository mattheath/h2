"use strict";

define([
    "../H1/Utils",
    "../H1/BaseAPI",
    "../H1/Errors/CustomerAPIError",
    "jquery",
    'q'
], function (Utils, BaseAPI, Error, $, Q) {

    /**
     * Represents H1 customer API endpoint
     * @param {String} baseURL The base url
     */
    var CustomerAPI = function (baseURL) {
        BaseAPI.call(this, baseURL);
    };

    Utils.extend(CustomerAPI, BaseAPI);

    /**
     * Call H1 Customer Api
     * @param  {object} params call options
     * @return {Q}      Promise
     */
    CustomerAPI.prototype.call = function (params) {
        var endpoint  = params.endpoint || '',
            method    = params.method   || 'post';

        return Q($.ajax({
                method: method,
                url: this.getUrl(endpoint),
                data: params.data
            }))
            .catch(function (xhr) {
                var response,
                    errorParams = {
                        service: 'customer',
                        endpoint: params.endpoint
                    };

                try {
                    response = JSON.parse(xhr.responseText);
                    errorParams.code = response.code;
                    errorParams.message = response.payload;
                    errorParams.debug = response.debug;
                    errorParams.type = response.type;
                    errorParams.status = xhr.status;
                } catch (e) {
                    // Could not parse JSON!
                    errorParams.code = null;
                    errorParams.message = "Could not parse the response:\n\n" + xhr.responseText;
                }

                throw new Error(errorParams);
            }).catch(this.onError);
    };

    /**
     * @param {string} endpoint
     */
    CustomerAPI.prototype.getUrl = function (endpoint) {
        var url = this._baseURL + '/v1/' + endpoint,
            sessionId = this._session.getId();

        if (!sessionId) {
            return url;
        }
        return url + '?api_token=' + encodeURIComponent(sessionId);
    };

    return CustomerAPI;

});
