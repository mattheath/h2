"use strict";

define(["src/Mixable"], function (Mixable) {

    module('Mixable');

    var Foo = function () {};

    var Bar = {
        hellos: [],
        baz: function () {
            this.hello = "world";
        },
        fizz: function (h) {
            this.hellos.push(h);
        }
    };

    test("Test mixin copies functions", function () {
        var foo = new Foo();
        Mixable.mixin(foo, Bar);
        ok (foo.baz instanceof Function);
        foo.baz();
        strictEqual(foo.hello, "world");
    });

    test("Test excluding of methods", function () {
        var foo = new Foo();
        Mixable.mixin(foo, Bar, ["baz"]);
        strictEqual(foo.baz, undefined);
    });

});
