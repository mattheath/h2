'use strict';

define([
    './H2/CallAPI',
    './Webapp/Config',
    './Webapp/ErrorHandler',
    './Webapp/GoogleAnalytics',
    './Webapp/Login',
    'q'
], function(API, Config, ErrorHandler, GoogleAnalytics, LoginWebapp, Q) {

    /**
     * Like Q(value).then(callback) but calling callback straightaway (i.e. not
     * in the next tick) if value is not a promise.
     *
     * @returns {Promise} The result of applying callback to value
     */
    var thenAsap = function(value, callback) {
        if (Q.isPromiseAlike(value)) {
            return value.then(callback);
        } else {
            try {
                return Q(callback(value));
            } catch (error) {
                return Q.reject(error);
            }
        }
    };

    /**
     * Common functionality for webapps using this toolkit
     *
     * @param {H2/CallAPI|Object} [params] An API or a list of params. If no API
     *     is specified it will be loaded from the config.
     * @param {H2/CallAPI} [params.api] An API
     * @param {Window} [params.windowAdapter]
     * @param {Object} [params.config] A list of properties
     * @param {boolean} [params.handleSession=true] Enable session handling?
     *
     * @property {H2/CallAPI} api (read-only) Available only when it's 'ready'
     *     (see below)
     * @property {Promise} config A Webapp/Config (read-only)
     * @property {Webapp/Login} loginWebapp (read-only) The login webapp used to
     *     authenticate the user. Available only if params.handleSession was true.
     * @property {Promise} ready (read-only) Resolves when the initial setup is done
     */
    return function(params) {

        var webapp = this;

        params = params instanceof API && {api: params} || params || {};
        params.handleSession = params.handleSession == null ? true : params.handleSession;

        this.config = Q(params.config || new Config);
        this._googleAnalytics = new GoogleAnalytics;

        var api = params.api || webapp.config.then(function(config) {
            return new API(config.environment.h2APIBaseURL);
        });

        // thenAsap() is required to support older webapps where they instantiate
        // an API on their own and expect for the stuff in 'ready' stuff to be
        // readily available without having to resolve any promise.
        this.ready = thenAsap(api, function(api) {
                webapp.api = api;

                webapp._errorHandler = new ErrorHandler({
                    api: api,
                    googleAnalytics: webapp._googleAnalytics,
                    window: params.windowAdapter
                });

                if (params.handleSession) {
                    webapp.loginWebapp = new LoginWebapp({ api: api });
                    webapp.loginWebapp.handleSession();
                }

                return webapp;
            });
    };
});
