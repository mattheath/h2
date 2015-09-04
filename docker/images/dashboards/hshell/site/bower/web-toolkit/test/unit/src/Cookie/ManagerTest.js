'use strict';

define([
    'src/CookieMock',
    'src/Cookie/Manager'
], function(CookieMock, CookieManager) {

    module('Cookie/Manager');

    var cookieManager = new CookieManager(new CookieMock);

    test("Test setting, getting and deleting a cookie", function() {
        strictEqual(cookieManager.get("foo"), undefined);
        cookieManager.set("foo", "bar");
        strictEqual(cookieManager.get("foo"), "bar");
        cookieManager.removeItem("foo");
        strictEqual(cookieManager.get("foo"), undefined);
    });

    test("Test multiple cookies work well", function() {
        strictEqual(cookieManager.get("foo"), undefined);
        strictEqual(cookieManager.get("hello"), undefined);

        cookieManager.set("foo", "bar");
        strictEqual(cookieManager.get("foo"), "bar");
        strictEqual(cookieManager.get("hello"), undefined);

        cookieManager.set("hello", "world");
        strictEqual(cookieManager.get("foo"), "bar");
        strictEqual(cookieManager.get("hello"), "world");

        cookieManager.removeItem("foo");
        strictEqual(cookieManager.get("foo"), undefined);
        strictEqual(cookieManager.get("hello"), "world");

        cookieManager.removeItem("hello");
        strictEqual(cookieManager.get("foo"), undefined);
        strictEqual(cookieManager.get("hello"), undefined);
    });

    test("Cookie domain", function() {
        equal(cookieManager._getRootDomain('127.0.0.1'), '127.0.0.1');
        equal(cookieManager._getRootDomain('localhost'), null);
        equal(cookieManager._getRootDomain('bar.foo.com'), '.foo.com');
        equal(cookieManager._getRootDomain('baz.bar.foo.com'), '.foo.com');
    });

    asyncTest('change is triggered when cookies change', 0, function() {
        var manager = new CookieManager(new CookieMock);
        manager.on('change', start);
        manager.setItem('foo', 'bar');
    });
});
