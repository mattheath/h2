"use strict";

define([
    "../H2/CallAPI",
    "../H2/Session/CookieStorage",
    '../H2/Service/Login',
    './Login/Overlay',
    "q",
    "uri/URI"
], function(Api, SessionStorage, LoginService, Overlay, Q, URI) {

    /**
     * @return string domain eg, hailoweb.com
     */
    var getDomain = function getDomain() {
        var domain, curURL = new URI();
        try {
            domain = curURL.domain();
        } catch (e) {
            domain = '';
        }
        return domain;
    };

    /**
     * The login webapp
     *
     * Used to avoid reimplementing the same session handling functionality in
     * every webapp.
     *
     * See https://github.com/hailocab/login-webapp
     *
     * @param {Object|H2/CallAPI} params
     * @param {H2/CallAPI} params.api
     * @param {string} [params.mechanism] The default one is chosen by H2/Service/Login
     * @param {string} [params.application=ADMIN]
     *
     * @property {Webapp/Login/Overlay|null} overlay The overlay with the login webapp
     */
    var Webapp = function(params) {
        if (params instanceof Api) params = {api: params};
        this.api = params.api;
        this.mechanism = params.mechanism || 'h2';
        this.application = params.application || 'ADMIN';
        this.deviceType = this.loginDevice();
        this.overlay = new Overlay(this);
    };

    /**
     * Get a login device from the domain
     * @return string
     */
    Webapp.prototype.loginDevice = function() {
        var domain = getDomain();
        if (domain == '') {
            return 'web';
        }
        return 'web-' + domain;
    }

    /**
     * Try to guess if we are behind the vpn by looking at the window's
     * root domain
     * @return bool
     */
    Webapp.prototype.isVPN = function() {
        if (getDomain() == 'hailovpn.com') {
            return true;
        }
        return false;
    }

    /**
     * Make the login webapp to handle the session automatically
     */
    Webapp.prototype.handleSession = function() {

        var webapp = this;

        new SessionStorage(this.api);

        // Authenticate the user and retry the request when an unauthenticated
        // user error occurs
        this.api.addErrorHandler(function(error) {
            if (!error.isUnauthenticated()) throw error; // Bubble up unrelated errors
            return webapp.login().then(function() {
                return webapp.api.call(error.service, error.endpoint, error.request);
            });
        });
    };

    /**
     * Shows the login webapp to the user
     *
     * @param {Object} [params]
     * @returns {Promise} Resolved when the user is authenticated
     */
    Webapp.prototype.login = function() {
        var webapp = this;
        return new LoginService(this.api)
            .sessionIsAuthenticated()
            .then(function (isAuthenticated) {
                if (isAuthenticated) {
                    return; // We are definitely sure we don't have to log in
                }
                var loggedIn = Q.defer();
                webapp.overlay.show();
                webapp.api.once('login', function() {
                    loggedIn.resolve();
                    webapp.overlay.hide();
                });
                return loggedIn.promise;
            });
    };

    return Webapp;
});
