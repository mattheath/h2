"use strict";

define(['q', 'require'], function(Q, require) {

    /**
     * An error occurred interacting with H2/CallAPI
     *
     * @returns {Promise} A rejected promise with the error
     */
    var APIError = function(params) {

        var error = this;

        this.stack = new Error().stack;
        this.service = params.service;
        this.endpoint = params.endpoint;
        this.request = params.request;
        this.httpStatus = params.xhr.status;
        this.api = params.api;
        this.session = params.session;

        try {
            var responseBody = params.xhr.responseText;
            var response = JSON.parse(responseBody);
            this.code = response.code;
            this.dotted_code = response.dotted_code;
            this.message = response.payload;
        } catch (parseError) {
            // We ignore parseError as we'll show the unparsed response later
            this.message = params.xhr.status ?
                'Error ' + params.xhr.status :
                'Network error or fetch termination (' + params.xhr.statusText + ')';
            if (responseBody) this.message += "\n\n" + responseBody;
        }

        return this._isUnauthenticatedError().then(function(itIs) {
            error._isUnauthenticated = itIs;
            throw error;
        });
    };

    APIError.prototype = Object.create(Error.prototype);

    APIError.prototype.toString = function() {
        return this.message + "\n\n" +
            "Error code: " + this.code + "\n" +
            "Service: " + this.service + "\n" +
            "Endpoint: " + this.endpoint + "\n" +
            "Request: " + JSON.stringify(this.request, null, 2);
    };

    /**
     * Check isUnauthenticated() and isForbidden() for the exact reason
     */
    APIError.prototype.isAccessDenied = function() {
        return this.code == 5 || this.code == 201;
    };

    /**
     * @returns {boolean} Is the error because the user is not authenticated?
     */
    APIError.prototype.isUnauthenticated = function() {
        return this._isUnauthenticated;
    };

    /**
     * @returns {boolean} Is the error because the user doesn't have the right
     *     permissions?
     */
    APIError.prototype.isForbidden = function() {
        return this.isAccessDenied() && !this.isUnauthenticated();
    };

    /**
     * @returns {boolean} Is the error because a nonexistent resource was requested?
     */
    APIError.prototype.isNotFound = function() {
        return this.httpStatus == 404;
    };

    /**
     * Because the backend is not telling us whether an access denied error is because
     * the user is unauthenticated, and the information we have about the session
     * can be outdated (e.g. the backend deleted the session), we read the session
     * details again to ensure we don't lie.
     *
     * @param {H2/CallAPI} API We can't use RequireJS to depend on H2/CallAPI as
     *     we would get a circular dependency.
     * @returns {Promise}
     */
    APIError.prototype._isUnauthenticatedError = function() {
        if (!this.isAccessDenied()) return Q();

        // Load them under demand to avoid circular dependencies
        var Api = require('../CallAPI');
        var LoginService = require('../Service/Login');

        // We don't use the original API to avoid using an invalid
        // authenticated session that would cause an infinite loop
        // trying to read the session.
        var api = new Api(this.api.getBaseURL());

        return new LoginService(api)
            .sessionIsAuthenticated(this.api.getSession())
            .then(function (isAuthenticated) { return !isAuthenticated; });
    };

    return APIError;
});
