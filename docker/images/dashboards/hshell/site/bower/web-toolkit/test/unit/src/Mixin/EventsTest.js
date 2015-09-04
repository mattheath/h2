"use strict";

define(["src/Mixin/Events"], function (Events) {

    module('Mixin/Events');

    var Foo = function () {};

    test("Test Events.on adds listeners", function () {
        var foo;

        foo = new Foo();
        Events.mixin(foo);

        strictEqual(foo._eventsGetListeners("eventId").length, 0);
        foo.on("bogusEventId", function () {});
        strictEqual(foo._eventsGetListeners("eventId").length, 0);
        foo.on("eventId", function () {});
        strictEqual(foo._eventsGetListeners("eventId").length, 1);
    });

    test("Test event listener is not triggered with invalid event id", function () {
        var foo, notified = false;

        foo = new Foo();
        Events.mixin(foo);

        foo.on("eventId", function () {
            notified = true;
        });

        foo.trigger("bogusEventId");

        strictEqual(notified, false);
    });

    test("Test event listener is triggered with valid event id", function () {
        var foo, notified = false;

        foo = new Foo();
        Events.mixin(foo);

        foo.on("eventId", function () {
            notified = true;
        });

        foo.trigger("eventId");

        strictEqual(notified, true);
    });

    test("Test multiple listeners on separate objects", function () {
        var foo;

        foo = new Foo();
        Events.mixin(foo);
        foo.notifiedCount = 0;
        foo.on("eventId", function() { this.notifiedCount += 1; });
        foo.on("eventId2", function() { this.notifiedCount += 1; });

        foo.trigger("eventId");

        strictEqual(foo.notifiedCount, 1);

        foo.trigger("eventId2");

        strictEqual(foo.notifiedCount, 2);
    });

    test("Test listener scope", function () {
        var foo, notified = "no";

        foo = new Foo();
        Events.mixin(foo);
        foo.name = "yes";
        foo.on("eventId", function() {
            notified = this.name;
        });

        foo.trigger("eventId");

        strictEqual(notified, "yes");
    });

    test("Test optional arguments passed to listener", function () {
        var foo, notified = "no";

        foo = new Foo();
        Events.mixin(foo);
        foo.name = "yes";
        foo.on("eventId", function(a, b) {
            notified = this.name + a + b;
        });

        foo.trigger("eventId", " yes", "!!!");

        deepEqual(notified, "yes yes!!!");
    });

    test("once() makes the listener to be executed once", function() {
        var mixed = Events.mixin({});   
        var executionsCount = 0;        
        mixed.once('whatever', function() { executionsCount++; });
        mixed.trigger('whatever');      
        mixed.trigger('whatever');      
        equal(executionsCount, 1);      
    });
        
    test('trigger() works with listeners altering the list of listeners', function() {
        var mixed = Events.mixin({});   
        var listeningsCount = 0;        
        mixed.once('whatever', function() { listeningsCount++; });
        mixed.once('whatever', function() { listeningsCount++; });
        mixed.trigger('whatever');      
        equal(listeningsCount, 2);      
    });     
});
