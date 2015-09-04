"use strict";

requirejs.config({
    paths: {
        underscore: "/bower/underscore/underscore",
        leaflet: "/bower/leaflet-dist/leaflet"
    },
    shim: {
        underscore: {
            exports: '_'
         }
    }
});