"use strict";

define([
    "../Mixin/Events",
    '../H2/Session'
], function(Events, Session) {

    /**
     * Represents Abstract API endpoint
     * @param {String} baseURL The base url
     */
    var BaseAPI = function (baseURL) {
        Events.mixin(this, baseURL);
        this._baseURL = baseURL;
        this.setSession(Session.createAnonymous());
    };

    /** 
     * Template method that handles failing call() executions
     *
     * Currently it's being used to ask the user to login when a call results in 
     * an access denied.
     *
     * @param {H2/CallAPI/Error} error
     * @returns {Promise} Will be the result of call()
     */
    BaseAPI.prototype.onError = function(error) {
        throw error;
    };

    /**
     * Get base url
     * @return {String} Base url for API
     */
    BaseAPI.prototype.getBaseURL = function() {
        return this._baseURL;
    };

    /**
     * @param {H2/Session|null} session If null is passed it is converted to an anonymous session
     */
    BaseAPI.prototype.setSession = function(session) {
        this._session = session || Session.createAnonymous();
        this.trigger('changeSession');
    };

    /**
     * @returns {H2/Session}
     */
    BaseAPI.prototype.getSession = function() {
        return this._session;
    };
    return BaseAPI;
});