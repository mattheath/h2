'use strict';

define(['../../Session'], function(Session) {

    // See https://github.com/hailocab/login-service/blob/master/src/Hailo/Login/Domain/Token/Token.php
    var parseToken = function(string) {
        return string.split(':').reduce(function(items, keyValueString) {
            var parts = keyValueString.match(/(^[^=]*)=(.*)$/);
            if (!parts) throw "Invalid syntax";
            items[parts[1]] = parts[2];
            return items;
        }, {});
    };

    return function(rawResponse) {
        this.getSession = function() {
            var token = parseToken(rawResponse.token);
            var sessionParams = {
                id: rawResponse.sessId,
                username: token.id,
                roles: token.r.split(',')
            };
            // only set the expiryDate if it's not an auto-renewing one
            if (!('rt' in token) || token.rt == '') {
                sessionParams.expiryDate = new Date(token.et * 1000);
            }
            return Session.createAuthenticated(sessionParams);
        };
    };
});
