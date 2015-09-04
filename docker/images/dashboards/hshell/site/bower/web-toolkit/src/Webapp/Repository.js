'use strict';

define([
    '../vendor/lodash-2.4.1',
    '../Environment',
    '../H2/Service/WebDiscovery',
    './Repository/Webapp'
], function(_, Environment, WebDiscovery, Webapp) {

    /**
     * The webapps in the same environment of 'api'
     *
     * @param {H2/CallAPI} api
     */
    var Repository = function(api) {
        this._api = api;
    };

    /**
     * @returns {Promise} As [Webapp]
     */
    Repository.prototype.getAll = function() {
        var repository = this;
        return new WebDiscovery(this._api).webapps().catch(function() {
            return repository._getDefault();
        });
    };

    /**
     * @param {string} id The webapp id
     * @returns {Promise} The Webapp with that id
     */
    Repository.prototype.get = function(id) {
        var repository = this;
        return new WebDiscovery(this._api).webapp(id).catch(function() {
            var webapp = _(repository._getDefault()).find(function (webapp) {
                return webapp.getId() == id;
            });
            if (webapp) return webapp;
            throw new Error("Webapp not found");
        });
    };

    /**
     * @returns {Array} As [Webapp]. The essential webapps we want to have even
     *     if web-discovery service is down.
     */
    Repository.prototype._getDefault = function () {
        var webapps = [];
        var environment = Environment.fromApiUrl(this._api.getBaseURL()).toString() || 'tst';

        var add = function(params) {
            var url = params.urls[environment];
            if (url) webapps.push(new Webapp({id: params.id, name: params.name, url: url}));
        };

        add({
            id: 'login',
            name: 'Login',
            urls: {
                live: 'https://login.hailoweb.com',
                lve:  'https://login.hailoweb.com',
                stg:  'https://login.stg.e.hailoweb.com',
                tst:  'https://login.tst.e.hailoweb.com'
            }
        });

        add({
            id: 'vpn-login',
            name: 'VPN Login',
            urls: {
                lve:  'https://vpn-login.hailovpn.com',
                stg:  'https://vpn-login.stg.e.hailovpn.com',
                tst:  'https://vpn-login.tst.e.hailovpn.com'
            }
        });

        return webapps;
    };

    return Repository;
});
