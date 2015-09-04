"use strict";

define([
    "../H1/Utils",
    "../H1/BaseAPI",
    "../H1/Errors/ToolsAPIError",
    "jquery",
    'q'
], function (Utils, BaseAPI, Error, $, Q) {

    /**
     * Represents H1 tools endpoint
     * @param {String} baseURL The base url
     */
    var ToolsAPI = function (baseURL) {
        BaseAPI.call(this, baseURL);
    };

    Utils.extend(ToolsAPI, BaseAPI);

    /**
     * Call H1 Tools Api
     * @param  {object} params call options
     * @return {Q}      Promise
     */
    ToolsAPI.prototype.call = function (params) {
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
                        service: 'tools',
                        endpoint: params.endpoint
                    };

                try {
                    response = JSON.parse(xhr.responseText);
                    errorParams.code = response.code;
                    errorParams.message = response.message;
                    errorParams.context = response.context;
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
    ToolsAPI.prototype.getUrl = function (endpoint) {
        var url = this._baseURL + '/' + endpoint,
            sessionId = this._session.getId();

        if (!sessionId) {
            return url;
        }
        return url + '?session_id=' + encodeURIComponent(sessionId);
    };

    return ToolsAPI;
});
