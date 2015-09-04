'use strict';

define(function() {

    return function () {

        var value = ""; // storing cookies here

        /**
         * @param {string} key
         * @returns {string} Returns a full cookie string, e.g.: "foo=bar; expires=Fri, 08 Nov 2999 11:25:13 GMT; path=/; domain=127.0.0.1"
         */
        function getCookieStringByKey(key) {
            var parts = value.split(";"), i, part,
                reservedKeys = ["expires", "path", "domain", "secure"],
                cookieString = "";

            for (i = 0; i < parts.length; i += 1) {
                part = parts[i];

                if (-1 !== part.indexOf(key + "=")) {
                    cookieString += part + ";";
                    continue;
                }

                if (-1 === reservedKeys.indexOf(part.trim().split("=").shift())) {
                    break;
                }

                cookieString += part + (i + 1 < parts.length ? ";" : "");
            }

            return cookieString;
        }

        /**
         * @param {string} key
         * @returns {object} Returns an object literal representation of a cookie
         */
        function getCookieObjectByKey(key) {
            var cookieString = getCookieStringByKey(key),
                cookieObject = {};

            if ("" === cookieString) {
                return;
            }

            cookieString.split(";").forEach(function (item) {
                var parts = item.trim().split("=");
                cookieObject[parts[0]] = parts[1];
            });

            return cookieObject;
        }

        /**
         * @param {string} cookieString
         * @returns {boolean} True if the cookies expire date is in the past, otherwise false
         */
        function shouldExpireCookie(cookieString) {
            var params = cookieString.split(";"), i, param,
                now = new Date();
            for (i = 0; i < params.length; i += 1) {
                param = params[i].trim();
                if (-1 !== param.indexOf("expires=") && new Date(param.split("=")[1]) < now) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Getter, this.cookie will return value
         */
        this.__defineGetter__("cookie", function() {
            return value;
        });

        /**
         * Setter. If a cookie with the same key already exists, it replaces it.
         * If the expiry date of the cookie is set in the past, it removes the cookie.
         * Otherwise it adds a brand new cookie.
         */
        this.__defineSetter__("cookie", function(newCookieString) {
            var params = newCookieString.split(";"),
                newCookieKey = params[0].trim().split("=").shift();
            if (getCookieObjectByKey(newCookieKey)) {
                if (shouldExpireCookie(newCookieString)) {
                    // Let's expire the cookie
                    value = value.replace(getCookieStringByKey(newCookieKey), "");
                } else {
                    // Cookie already exists, let's replace it
                    value = value.replace(getCookieStringByKey(newCookieKey), newCookieString);
                }
                return value;
            }
            // It's a new cookie, yay
            value += (value ? ";" : "") + newCookieString;
            return value;
        });

    };

});