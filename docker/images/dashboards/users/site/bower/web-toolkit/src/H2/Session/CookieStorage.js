'use strict';

define([
    "../../Cookie/Manager",
    '../Session', 
    'uri/URI'
], function(CookieManager, Session, URI) {

    var key = 'session';

    /**
     * Handles the persistence of callAPI session
     *
     * - Restores the session during the instantiation and when the session in the
     *   real storage changes.
     * - Persists callAPI session when it changes.
     *
     * @param {H2/CallAPI} callAPI
     * @param {Document} documentAdapter Only document.cookie is being used
     */
    return function(callAPI, documentAdapter) {

        /**
         * When there are breaking changes in the data being stored it's easier 
         * to simply change the version and invalidate the data altogether instead 
         * of trying to interpret what's in there.
         */
        this._schemaVersion = '4';

        /**
         * @param {H2/Session} session
         */
        this._setSession = function(session) {
            var sessionsProperties = this._getContent();
            var apiBaseUrl = this._getNormalizedApiBaseUrl();

            if (session.isAuthenticated()) {
                sessionsProperties[apiBaseUrl] = session;   
            } else {
                delete sessionsProperties[apiBaseUrl];
            }

            this._setContent(sessionsProperties);
        };

        /**
         * @returns {H2/Session} The stored session or an anonymous one
         */
        this._getSession = function() {
            var properties = this._getContent()[this._getNormalizedApiBaseUrl()] || {};
            if (!properties.id) {
                return Session.createAnonymous();
            }
            if (properties.expiryDate) {
                properties.expiryDate = new Date(properties.expiryDate);
            }
            return Session.createAuthenticated(properties);
        };

        this._setContent = function(content) {
            cookies.setItem(key, JSON.stringify({
                schemaVersion: this._schemaVersion,
                content: content
            }));
        };

        this._getContent = function() {
            var json = cookies.getItem(key);
            if (json) {
                var data = JSON.parse(decodeURIComponent(json));
                if (data.schemaVersion == this._schemaVersion) {
                    return data.content;
                }
            }
            return {};
        };

        this._restore = function() {
            callAPI.setSession(this._getSession());
        };

        /**
         * Because every webapp can use a slightly different version of the same 
         * URL (https://api2.elasticride.com, https://api2.elasticride.com/, 
         * https://api2.elasticride.com:443, ...) here me make sure we always use the 
         * normalized version.
         *
         * This is specially important when using the login webapp as the URL is 
         * not being passed and not all the configurations of every webapp define 
         * the API URL in the same way, resulting in the impossiblity to log in 
         * or having to log in multiple times against the same API just because 
         * these differences.
         */
        this._getNormalizedApiBaseUrl = function() {
            return new URI(callAPI.getBaseURL()).normalize().toString();
        };

        var storage = this;
        var cookies = new CookieManager(documentAdapter || document);
        cookies.on('change', function() { storage._restore(); });
        callAPI.on("changeSession", function() { storage._setSession(callAPI.getSession()); });
        this._restore();
    };
});
