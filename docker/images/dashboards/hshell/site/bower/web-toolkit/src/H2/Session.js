'use strict';

define(function() {

    /**
     * An anonymous or authenticated session on H2
     *
     * @see createAnonymous
     * @see createAuthenticated
     */
    var Session = function(properties) {
        this._properties = properties;
    };

    /**
     * Creates an anonymous session
     */
    Session.createAnonymous = function() {
        return new this({});
    };

    /**
     * Creates an authenticated session
     *
     * @param {Object} params
     * @param {string} params.id The session id
     * @param {string} params.username
     * @param {Date} [params.expiryDate]
     * @param {Date} [params.roles=[]]
     */
    Session.createAuthenticated = function(properties) {
        return new this(properties);
    };

    Session.prototype.getId = function() {
        return this._getActiveProperties().id;
    };

    Session.prototype.getUsername = function() {
        return this._getActiveProperties().username;
    };

    Session.prototype.getRoles = function() {
        return this._getActiveProperties().roles || [];
    };
    
    /**
     * @returns {Date|nullish}
     */
    Session.prototype.getExpiryDate = function() {
        return this._properties.expiryDate;
    };

    /**
     * @returns {boolean} Whether the session represents an authenticated user and
     *     it hasn't expired.
     */
    Session.prototype.isAuthenticated = function() {
        return !!this.getId();
    };

    Session.prototype.toJSON = function() {
        return this._properties;
    };

    /**
     * @returns {Object} The properties of the session. It will empty if the session 
     *     is not active.
     */
    Session.prototype._getActiveProperties = function() {
        return this._hasExpired() ? {} : this._properties;
    };

    /**
     * @returns {boolean} Whether the session has expired
     */
    Session.prototype._hasExpired = function() {
        var expiryDate = this.getExpiryDate();
        return expiryDate && expiryDate <= new Date;
    };

    return Session;
});
