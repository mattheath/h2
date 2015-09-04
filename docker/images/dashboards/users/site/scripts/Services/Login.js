// Extends the LoginService object from the web-toolkit to add some
// new methods.
// These methods should eventually be added to the web-toolkit itself.
'use strict';

define(['underscore', 'web-toolkit/H2/Service/Login'], function (_, Service) {

    /**
     * Creates a user
     *
     * @param {Object} request The request
     * @returns {Promise} Empty object is returned on success
     */
    Service.prototype.createUser = function(req) {
        return this._api.call('com.hailocab.service.login', 'createuser', req);
    };

    /**
     * Changes a user's ids
     *
     * @param {Object} request The request
     * @returns {Promise} Empty object is returned on success
     */
    Service.prototype.changeIDs = function(req) {
        return this._api.call('com.hailocab.service.login', 'changeids', req);
    };
    
    /**
     * Changes a user's roles
     *
     * @param {Object} request The request
     * @returns {Promise} Empty object is returned on success
     */
    Service.prototype.updateUserRoles = function(req) {
        return this._api.call('com.hailocab.service.login', 'updateuserroles', req);
    };

    /**
     * Lists users
     *
     * @param {Object} request The request
     * @returns {Promise} 
     */
    Service.prototype.listUsers = function(req) {
        return this._api.call('com.hailocab.service.login', 'listusers', req);
    };

    /**
     * Get a single user
     *
     * @param {Object} request The request
     * @returns {Promise} 
     */
    Service.prototype.readUser = function(req) {
        return this._api.call('com.hailocab.service.login', 'readuser', req);
    };

    /**
     * Change password
     *
     * @param {Object} request The request
     * @returns {Promise} 
     */
    Service.prototype.changePassword = function(req) {
        var request = req || {};
        request.mech = 'h2';
        return this._api.call('com.hailocab.service.login', 'changepassword', req);
    };

    /**
     * Expire password
     *
     * @param {Object} request The request
     * @returns {Promise} 
     */
    Service.prototype.expirePassword = function(req) {
        return this._api.call('com.hailocab.service.login', 'expirepassword', req);
    };

    return Service;
});
