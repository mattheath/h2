'use strict';

define([], function() {
    var Utils = {
        // Quite simple inheritance
        extend: function (Sub, Base) {
            // copy static properties
            for (var prop in Base) {
                if (Base.hasOwnProperty(prop)) {
                    Sub[prop] = Base[prop];
                }
            }
            function DummyClass() {
                this.constructor = Sub;
            }
            DummyClass.prototype = Base.prototype;
            Sub.prototype = new DummyClass;
        }
    };
    return Utils;
});
