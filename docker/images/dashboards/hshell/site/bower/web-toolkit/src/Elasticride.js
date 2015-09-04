'use strict';

define(['./Environment'], function(Environment) {

    /**
     * @param {string} environment Either 'live', 'staging' or 'test'
     */
    var Elasticride = function(environment) {
        this._environment = environment;
    };

    /**
     * @param {string} customerId
     * @returns {string|falsy} The customer detail URL or falsy if the environment
     *     is unknown
     */
    Elasticride.prototype.getCustomerURL = function(customerId) {
        var environment = new Environment(this._environment).toElasticride();
        return environment && 'https://elasticride.com/customers/' +
            environment + '/view/' + encodeURIComponent(customerId);
    };

    return Elasticride;
});
