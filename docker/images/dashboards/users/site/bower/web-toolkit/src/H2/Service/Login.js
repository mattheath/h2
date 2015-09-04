'use strict';

define([
    '../CallAPI/Error',
    '../Session',
    './Login/AuthResponse',
    'q'
], function(ApiError, Session, AuthResponse, Q) {

    /**
     * Interface to the https://github.com/hailocab/go-login-service
     *
     * @param {H2/CallAPI} api
     */
    var Service = function(api) {
        this._api = api;
    };

    /**
     * Authenticates the user
     *
     * @param {Object|string} request The request or the username
     * @param {string} [password]
     * @returns {Promise} The details of the session (see H2/Service/Login/Session)
     */
    Service.prototype.auth = function(request, password) {
        if (typeof request == 'string') request = {username: request};
        if (password) request.password = password;
        request.mech = request.mech || 'admin';
        request.deviceType = request.deviceType || 'web';
        return this._api.call('com.hailocab.service.login', 'auth', request)
            .then(function(response) { return new AuthResponse(response); });
    };

    /**
     * Authenticates the user and initialises the session with his details
     *
     * @param {string|Object} username or a request object
     * @param {string} [password]
     * @returns {Promise}
     */
    Service.prototype.login = function(username, password) {
        var service = this;
        return this.auth(username, password).then(function(response) {
            service._api.setSession(response.getSession());
        });
    };

    /**
     * @returns {H2/CallAPI}
     */
    Service.prototype.getAPI = function() {
        return this._api;
    };

    /**
     * @param {H2/Session|string} [session] See _getSessionId()
     * @returns {Promise} Resolved as a H2/Session
     */
    Service.prototype.readSession = function(session) {
        return this._api
            .call('com.hailocab.service.login', 'readsession', {
                sessId: this._getSessionId(session)
            })
            .then(function(response) {
                return new AuthResponse(response).getSession();
            });
    };

    /**
     * @param {H2/Session|string} [session] See _getSessionId()
     * @returns {Promise(boolean)}
     */
    Service.prototype.sessionIsAuthenticated = function (session) {
        var sessionId = this._getSessionId(session);
        if (!sessionId) return Q(false);
        return this.readSession(sessionId)
            .then(function(session) { return session.isAuthenticated(); })
            .catch(function(error) {
                if (error instanceof ApiError && error.isNotFound()) return false;
                throw error;
            });
    };

    /**
     * Removes the session both from api (H2/CallAPI) and the backend
     *
     * @returns {Promise}
     */
    Service.prototype.logout = function() {
        var service = this;
        return this._api
            .call('com.hailocab.service.login', 'deletesession', {
                sessId: this._api.getSession().getId()
            })
            .then(function() { service._api.setSession(null); });
    };

    /**
     * @param {H2/Session|string} [session] A session, a session ID or nothing
     *     to use API session.
     * @returns {string|nullish} The session ID or null-ish if it's anonymous
     */
    Service.prototype._getSessionId = function (session) {
        if (session instanceof Session) return session.getId();
        if (session) return session;
        return this._api.getSession().getId();
    };

    return Service;
});
