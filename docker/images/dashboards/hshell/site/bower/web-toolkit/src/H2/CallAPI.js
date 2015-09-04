"use strict";

define([
    "../Mixin/Events",
    "./CallAPI/Error",
    './Session',
    '../vendor/lodash-2.4.1',
    "jquery",
    'q'
], function (Events, Error, Session, _, $, Q) {

    /**
     * ValidRegions is a hard-coded list of valid API regions
     */
    var validRegions = [
        'eu-west-1',
        'us-east-1'
    ];

    /**
     * changeURLRegion replaces the region in a url.
     *
     * @param {string} url Original URL
     * @param {string} region Required region (must be valid)
     * @return {string} New url
     */
    var changeURLRegion = function(url, region) {
        // If we find a valid region in the url, replace it
        if (validRegions.indexOf(region) != -1) {
            var curRegion = _.find(validRegions, function(r) {
                if (url.indexOf(r) != -1) {
                    return true;
                }
                return false;
            });
            if (curRegion) {
                return url.replace(curRegion, region);
            }
        }
        return url;
    };

    /**
     * Represents the https://github.com/hailocab/call-api endpoint
     *
     * @param {Object|string} params A list of params or the base URL
     * @param {string} params.baseUrl URL to the call-api endpoint, without any
     *     /v2/h2/... path or / in the end (e.g. https://example.com:1234)
     *
     * Events:
     * - changeSession: The session has changed, either because a session has been
     *   assigned to the API or the current session has expired.
     * - login: After a session change, the session becomes an authenticated one.
     * - logout: After a session change, the session becomes an unauthenticated one.
     */
    var API = function (params) {
        params = typeof params == 'string' && {baseUrl: params} || params;
        Events.mixin(this);
        this._baseURL = params.baseUrl;
        this._timeout = params._timeout || 10 /* seconds */ * 1000;
        this.setSession(Session.createAnonymous());
        this._handleSessionAuthenticationEvents();
        this._handleSessionExpiry();

        // _region can be set to override the API URL's default region
        this._region = null;
    };

    API.prototype.resetRegion = function () {
        this._region = null;
    }; 

    /**
     * @param {string} region A valid region, E.g. eu-west-1
     */
    API.prototype.setRegion = function (region) {
        if (validRegions.indexOf(region) != -1) {
            this._region = region;
        }
    }; 

    /**
     * @return {string|null} the current region override if set
     */
    API.prototype.getRegion = function () {
        return this._region;
    }; 

    /**
     * @return {array} The hard-coded list of valid regions
     */
    API.prototype.getValidRegions = function () {
        return validRegions;
    }; 

    /**
     * @param {string} service E.g. com.hailocab.service.helloworld
     * @param {string} endpoint E.g. sayhello
     * @param {Object} [request] E.g. {name: 'Barty'}
     * @returns {Promise} The result of the call or a H2/CallAPI/Error
     */
    API.prototype.call = function (service, endpoint, request) {
        var api = this;
        var session = this._session; // Keep a reference in case it changes later
        request = request || {};
        return Q($.ajax({
                type: 'post',
                url: this.getUrl(service, endpoint),
                data: {
                    service: service,
                    endpoint: endpoint,
                    request: JSON.stringify(request, null, 4)
                },
                timeout: this._timeout
            }))
            .catch(function(xhr) {
                return new Error({
                    service: service,
                    endpoint: endpoint,
                    request: request,
                    xhr: xhr,
                    session: session,
                    api: api
                });
            })
            .catch(this.onError);
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
    API.prototype.onError = function(error) {
        throw error;
    };

    /**
     * @param {function} handler Used as in call().catch(previousHandler).catch(handler)
     */
    API.prototype.addErrorHandler = function(handler) {
        var previousHandler = this.onError;
        this.onError = function(error) {
            return Q.reject(error)
                .catch(previousHandler)
                .catch(handler);
        };
    };

    /**
     * @return {string} base URL for this API - region is substituted if set
     */
    API.prototype.getBaseURL = function() {
        if (this._region != null) {
            return changeURLRegion(this._baseURL, this._region);
        }
        return this._baseURL;
    };

    /**
     * @param {string} service
     * @param {string} endpoint
     */
    API.prototype.getUrl = function (service, endpoint) {
        var url = this.getBaseURL() + '/v2/h2/call';

        url += '?' + service + '/' + endpoint; // For easy debugging purposes

        var sessionId = this._session.getId();
        if (sessionId) url += '&session_id=' + encodeURIComponent(sessionId);

        return url;
    };

    /**
     * @param {H2/Timeout|null} timeout If null is passed it is defaulted to 10 seconds
     */
    API.prototype.setTimeout = function(timeout) {
        this._timeout = timeout || 10 /* seconds */ * 1000;        
    };

    /**
     * @param {H2/Session|null} session If null is passed it is converted to an anonymous session
     */
    API.prototype.setSession = function(session) {
        this._session = session || Session.createAnonymous();
        this.trigger('changeSession');
    };

    /**
     * @returns {H2/Session}
     */
    API.prototype.getSession = function() {
        return this._session;
    };

    API.prototype._handleSessionAuthenticationEvents = function() {
        this.on('changeSession', function() {
            this.trigger(this.getSession().isAuthenticated() ? 'login' : 'logout');
        });
    };

    /**
     * Triggers a 'logout' as soon as the session expires
     */
    API.prototype._handleSessionExpiry = function() {
        var api = this;
        var handledSession = this.getSession();
        var timeoutId;
        this.on('changeSession', function() {
            if (this.getSession() === handledSession) return;
            handledSession = this.getSession();
            clearTimeout(timeoutId);
            if (handledSession.getExpiryDate()) {
                timeoutId = setTimeout(function() {
                    api.trigger('changeSession');
                }, handledSession.getExpiryDate().getTime() - Date.now());
            }
        });
    };

    return API;
});
