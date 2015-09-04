'use strict';

define(['src/CookieMock'], function(CookieMock) {

    module('CookieMock');

    function generateFooCookie(expires) {
        return "foo=bar; expires=" + expires.toUTCString() + "; path=/; domain=127.0.0.1";
    }

    test("Test adding cookies", function() {
        var mock = new CookieMock(),
            foo = "foo=bar; expires=Fri, 08 Nov 2999 11:25:13 GMT; path=/; domain=127.0.0.1",
            hello = "hello=world; expires=Fri, 08 Nov 2999 11:25:16 GMT; path=/; domain=127.0.0.1";

        strictEqual(mock.cookie, "");

        mock.cookie = foo;
        strictEqual(mock.cookie, foo);

        mock.cookie = hello;
        strictEqual(mock.cookie, foo + ";" + hello);
    });

    test("Test replacing a cookie", function() {
        var mock = new CookieMock(),
            foo = "foo=bar; expires=Fri, 08 Nov 2999 11:25:13 GMT; path=/; domain=127.0.0.1",
            foo2 = "foo=lipsum; expires=Fri, 08 Nov 2999 11:25:16 GMT; path=/; domain=127.0.0.1";

        strictEqual(mock.cookie, "");

        mock.cookie = foo;
        strictEqual(mock.cookie, foo);

        mock.cookie = foo2;
        strictEqual(mock.cookie, foo2);

        mock.cookie = foo;
        strictEqual(mock.cookie, foo);
    });

    test("Test expiring a cookie", function() {
        var mock = new CookieMock(),
            expires = new Date(),
            foo;

        strictEqual(mock.cookie, "");

        expires.setTime(expires.getTime() + 60000);
        foo = generateFooCookie(expires);
        mock.cookie = foo;
        strictEqual(mock.cookie, foo);

        // 120k miliseconds = 120s = before we added 60s, so now it will be 60s in the past
        expires.setTime(expires.getTime() - 120000);
        foo = generateFooCookie(expires);
        mock.cookie = foo;
        strictEqual(mock.cookie, "");
    });
});