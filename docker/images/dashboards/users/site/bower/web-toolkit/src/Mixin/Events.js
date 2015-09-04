"use strict";

define(["../Mixable"], function(Mixable) {

    return {

        /**
         * Mixin events to a target object.
         *
         * @param target: instance of object (e.g. new Foo())
         * @param source: object literal (e.g. {} with functions inside)
         */
        mixin: function (target) {
            return Mixable.mixin(target, this, ["mixin"]);
        },

        /**
         * Trigger an event. This will iterate over and call registered listener functions.
         *
         * @param {String} eventId
         */
        trigger: function (eventId) {
            var args = Array.prototype.slice.call(arguments, 1), that = this;
            // slice() avoids listeners to alter the iteration
            var listeners = this._eventsGetListeners(eventId).slice(0);
            listeners.forEach(function(listener) { listener.apply(that, args); });
        },

        /**
         * Listen to an event.
         *
         * @param {String} eventId
         * @param {Function} listener
         */
        on: function (eventId, listener) {
            this._eventsGetListeners(eventId).push(listener);
        },

        /**
         * Removes a listener
         *
         * @param {string} eventId
         * @param {function} listener
         */
        off: function(eventId, listener) {
            this._eventsGetListeners(eventId).forEach(function(_listener, i, listeners) {
                if (_listener == listener) listeners.splice(i, 1);
            });
        },

        /**
         * Like on() but executes the listener only a single time
         *
         * @param {string} eventId
         * @param {function} listener
         */
        once: function(eventId, listener) {
            this.on(eventId, function wrapper() {
                this.off(eventId, wrapper);
                listener.apply(this, arguments);
            });
        },

        /**
         * Return all listeners subscribed to an event.
         *
         * @param {String} eventId
         * @return {Array}
         */
        _eventsGetListeners: function (eventId) {
            if (undefined === this._eventsListeners) {
                this._eventsListeners = {};
            }
            if (undefined === this._eventsListeners[eventId]) {
                this._eventsListeners[eventId] = [];
            }
            return this._eventsListeners[eventId];
        }

    };

});
