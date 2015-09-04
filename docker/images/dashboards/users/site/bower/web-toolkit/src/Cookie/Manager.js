'use strict';

define(['../Mixin/Events'], function(Events) {

    /**
     * Constructor.
     *
     * @param {undefined||document} documentAdapter Either a mock of the window.document or undefined, in which case window.document will be used.
     * @returns instance of H2/Cookie/Manager
     */
    return function (documentAdapter) {

        var manager = this;
        Events.mixin(this);
        documentAdapter = documentAdapter || document;

        var documentCookie = documentAdapter.cookie;
        setInterval(function() {
            if (documentAdapter.cookie != documentCookie) {
                documentCookie = documentAdapter.cookie;
                manager.trigger('change');
            }
        }, 1000);

        /**
         * Save a cookie
         *
         * @param {string} key
         * @param {string} value
         * @param {integer} expires Number of hours after which the cookie will expire
         */
        this.set = function (key, value, expires) {
            var cookie = key + "=" + value + "; path=/";

            var domain = this._getRootDomain();
            if (domain) cookie += '; domain=' + domain;

            if (expires) {
                if (!(expires instanceof Date)) expires = new Date(Date.now() + expires * 3600 * 1000);
                cookie += "; expires=" + expires.toUTCString();
            }

            documentAdapter.cookie = cookie;
        };

        /**
         * Delete a cookie.
         *
         * @param {string} key
         * @returns void
         */
        this.removeItem = function (key) {
            this.set(key, "", -1);
        };

        /**
         * Fetch a cookie from the document.
         *
         * @param {string} key
         * @returns {string|undefined}
         */
        this.get = function (key) {
            var name = key + "=",
                cookieArr = documentAdapter.cookie.split(';'),
                i, c;
            for(i = 0; i < cookieArr.length; i += 1) {
                c = cookieArr[i];
                while (" " === c.charAt(0)) {
                    c = c.substring(1, c.length);
                }
                if (0 === c.indexOf(name)) {
                    return c.substring(name.length, c.length);
                }
            }
            return undefined;
        };

        /**
         * Alias for this.set
         *
         * @param {string} key
         * @param {string} value
         * @returns void
         */
        this.setItem = function (key, value) {
            this.set(key, value, 365 * 24); // 1 year
        };

        /**
         * Alias for this.get
         *
         * @param {string} key
         * @returns {string|undefined}
         */
        this.getItem = function (key) {
            return this.get(key);
        };

        /**
         * @returns {string|null} The root domain to be used to store the cookie.
         *     It's null in the case no domain should be set.
         */
        this._getRootDomain = function(hostname) {
            if (!hostname) hostname = window.location.hostname;
            if (hostname.match(/^(\d|\.)+$/)) return hostname; // IP
            if (hostname == 'localhost') return null; // See http://stackoverflow.com/a/1188145/337172
            return '.' + hostname.split('.').slice(-2).join('.'); // webapp.elasticride.com -> .elasticride.com
        };
    };
});
