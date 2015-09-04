"use strict";

define(['src/H2/Service/Login/AuthResponse'], function(AuthResponse) {

    module('H2/Service/Login/AuthResponse');

    test("Session details are extracted properly", function() {
        var response = {
            sessId: '+LsHEmIC6nJ+Fln0FGhCA26o20ZE6jUjr8kPKvWiCN2tX9Eq3W7OkoGT5TBcf0p+',
            token: 'am=admin:d=web:id=barty:ct=1381166314:et=1381195114:rt=:r=ADMIN:sig=Tfmqb9qH8cOnWRM8mQnhSXEGI9MX52JYrr9Nlwr6aLOcNONL7HOjmCpAKzz2zOkkXsouX+n22dlCUtOQ13TkpThUVEnH+6nPpTg6qGwa7o4vbJ7TFbsOG21CqM3pBqFoaJAoYzw8r9epbpY0GqR/z1a7UEDF3xlIyWSQcOCDNM8='
        };
        var session = new AuthResponse(response).getSession();
        strictEqual(session._properties.id, '+LsHEmIC6nJ+Fln0FGhCA26o20ZE6jUjr8kPKvWiCN2tX9Eq3W7OkoGT5TBcf0p+');
        strictEqual(session._properties.username, 'barty');
        deepEqual(session._properties.expiryDate, new Date(1381195114000));
        deepEqual(session._properties.roles, ['ADMIN']);
    });
});
