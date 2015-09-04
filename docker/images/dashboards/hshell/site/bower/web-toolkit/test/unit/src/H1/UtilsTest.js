'use strict';

define(['src/H1/Utils'], function(Utils) {
    
    module('Utils');

    var ClassA = function() {
        this.testVariable = "defined";
    };

    ClassA.staticProperty = 'test';

    ClassA.prototype = {
        testMethod: function() {
            return 'theMethod';
        }
    };

    test("Test subclass inherits baseclass methods", function () {
        var ClassB = function() {};
        Utils.extend(ClassB, ClassA);
        var classA = new ClassA();
        var classB = new ClassB();

        ok(classB.testMethod instanceof Function);
        strictEqual(classA.testMethod, classB.testMethod);
        strictEqual(ClassB.prototype.testMethod, ClassA.prototype.testMethod);
    });

    test("Test changing subclass prototype doesn't affect base class prototype", function() {
        var ClassC = function() {};
        Utils.extend(ClassC, ClassA);
        ClassC.prototype.anotherMethod = function() {};

        ok(typeof ClassA.prototype.anotherMethod === 'undefined');
    });

    test("Test static properties are copied over", function() {
        var ClassD = function() {};
        Utils.extend(ClassD, ClassA);

        strictEqual(ClassA.staticProperty, ClassD.staticProperty);

    });
});
