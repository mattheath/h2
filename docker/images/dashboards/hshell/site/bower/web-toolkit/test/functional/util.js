'use strict';

define([
    'src/vendor/lodash-2.4.1',
    "src/H2/CallAPI",
    'src/H2/Service/Login'
], function(_, API, LoginService) {

    var Util = function() {
    };

    // If somebody deletes the user:
    // - ssh to one of the `mass --list='^services\d' --test` instances
    // - /var/www/login-service/current/scripts/cli/add-user.php -u web-toolkit-test -p Password1
    // - /var/www/login-service/current/scripts/cli/add-user.php -u web-toolkit-test-admin -p Password1 -r ADMIN
    Util.prototype.username = 'web-toolkit-test';
    Util.prototype.adminUsername = 'web-toolkit-test-admin';
    Util.prototype.password = 'Password1';

    /**
     * @param {Object} [params]
     * @param {string} [params.userType]
     * @returns {Promise} A H2/CallAPI with an authenticated session
     */
    Util.prototype.createAuthenticatedAPI = function(params) {
        params = params || {};
        return this.login({
            api: this.createAPI(),
            userType: params.userType
        });
    };

    /**
     * @returns {H2/CallAPI}
     */
    Util.prototype.createAPI = function(params) {
        return new API(_.extend({
            baseUrl: 'https://api2-tst.elasticride.com'
        }, params));
    };

    /**
     * @param {H2/CallAPI|Object} params
     * @param {H2/CallAPI} params.api
     * @param {string} [params.userType]
     * @returns {Promise} The api with an authenticated session
     */
    Util.prototype.login = function(params) {
        params = params || {};
        if (params instanceof API) params = {api: params};
        var username = params.userType == 'admin' ? this.adminUsername : this.username;
        return new LoginService(params.api)
            .login(username, this.password)
            .then(function() { return params.api; });
    };

    return new Util;
});
