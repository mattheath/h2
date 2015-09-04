'use strict';

define(function() {

    /**
     * An error that can be considered a warning
     *
     * Useful to handle recoverable situations
     *
     * @extends Error
     * @property {*} data
     * @property {Error} error
     *
     * @param {Object} params
     * @param {*} params.data Any data that can help to recover from the warning
     * @param {Array} params.error The error that caused the warning
     * @param {string} [params.message] The error message
     *
     * Error inheritance based on http://stackoverflow.com/a/5251506/337172
     */
    var Warning = function(params) {
        this.data = params.data;
        this.error = params.error;
        this.stack = new Error().stack;
        this.message = params.message || 'Warning: ' + (this.error.message || this.error);
    };

    Warning.prototype = new Error;

    Warning.prototype.name = 'Warning';

    /**
     * A convenience method to ignore warnings in the context of a Promise
     *
     * Example:
     *     Q.reject(new Warning({data: 'foo'}))
     *         .catch(Warning.thenIgnore)
     *         .then(function(value) { console.log(value); }); // 'foo'
     */
    Warning.thenIgnore = function(error) {
        if (error instanceof Warning) return error.data;
        throw error;
    };

    return Warning;
});
