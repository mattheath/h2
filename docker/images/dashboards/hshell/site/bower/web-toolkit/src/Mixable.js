"use strict";

define(function() {

    return {

        /**
         * Binds functions from the source to the target object.
         * Properties won't be copied over.
         * Let's keep this simple.
         *
         * @param target: instance of object (e.g. new Foo())
         * @param source: object literal (e.g. {} with functions inside)
         */
        mixin: function (target, source, exclude) {
            var property;
            exclude = exclude || [];
            for (property in source) {
                if (source.hasOwnProperty(property) && -1 === exclude.indexOf(property)) {
                    target[property] = source[property];
                }
            }
            return target;
        }

    };

});
