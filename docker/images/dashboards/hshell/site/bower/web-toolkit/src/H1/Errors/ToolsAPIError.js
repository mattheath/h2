/**
 * An error occurred interacting with API
 */
define(function() {
    "use strict";

    return function(params) {
        this.code = params.code;
        this.message = params.message;
        this.service = params.service;
        this.endpoint = params.endpoint;
        this.context = params.context;
        this.type = params.type;
        this.status = params.status;

        this.toString = function() {
            return this.message + "\n\n" +
                "・Error code: " + this.code + "\n" +
                "・Service: " + this.service + "\n" +
                "・Endpoint: " + this.endpoint;
        };

        this.isAccessDenied = function() {
            return this.code == 5;
        };
    };
});
