/*global requirejs, require*/

"use strict";
require(["/scripts/widgets/city/amd.js"], function(City) {
    (new City()).bind([
        "London",
        "Dublin",
        "Cork",
        "Limerick",
        "Galway",
        "Barcelona",
        "Madrid",
        "Boston",
        "Chicago",
        "Washington DC",
        "New York",
        "Toronto",
        "Montréal",
        "東京 Tokyo",
        "大阪 Osaka"
    ], function (city) {
        // this is a callback, when city gets selected, this is called, do whatever here
        console.log(city);
    });
});
