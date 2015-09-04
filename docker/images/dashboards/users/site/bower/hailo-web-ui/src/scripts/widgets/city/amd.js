/*global define, document, window*/

define([], function () {

    "use strict";

    return function () {

        var that = this,
            allCities,
            matchingCities,
            selectedCity,
            blankInputMessage = "Choose a city...",
            citySelectedCallback;

        function resetCityList(cityList) {
            if (cityList) {
                while (cityList.firstChild) {
                    cityList.removeChild(cityList.firstChild);
                }
            }
        }

        function populateCityList(cityList) {
            var i, c, listItem;
            for (i = 0; i < matchingCities.length; i += 1) {
                c = matchingCities[i];
                listItem = document.createElement('li');
                listItem.appendChild(document.createTextNode(c));
                cityList.appendChild(listItem);
            }
        }

        function cityFocus(widgetNode) {
            var cityList = widgetNode.getElementsByClassName("city-list")[0],
                city = widgetNode.getElementsByClassName("city")[0];
            resetCityList(cityList);
            populateCityList(cityList);
            city.value = "";
            return false;
        }

        function cityBlur(widgetNode) {
            var cityList = widgetNode.getElementsByClassName("city-list")[0],
                city = widgetNode.getElementsByClassName("city")[0];
            cityList.style.display = "none";
            cityList.style.visibility = "hidden";
            if (undefined === selectedCity) {
                city.value = blankInputMessage;
            } else {
                city.value = selectedCity;
            }
            return false;
        }

        function selectCity(city) {
            selectedCity = city;
            if (undefined !== citySelectedCallback) {
                citySelectedCallback(selectedCity);
            }
        }

        function getMatchingCities(cities, text) {
            var i, matching = [];
            for (i = 0; i < cities.length; i += 1) {
                if (-1 !== cities[i].indexOf(text)) {
                    matching.push(cities[i]);
                }
            }
            return matching;
        }

        function toggleFilteredCities(cityList, city) {
            if (city.value.length > 0 && ("block" !== cityList.style.display || "visible" !== cityList.style.visibility)) {
                cityList.style.display = "block";
                cityList.style.visibility = "visible";
            } else if (0 === city.value.length) {
                cityList.style.display = "none";
                cityList.style.visibility = "hidden";
            }
        }

        function cityKeyDown(widgetNode) {
            var cityList = widgetNode.getElementsByClassName("city-list")[0],
                city = widgetNode.getElementsByClassName("city")[0],
                e = window.event,
                text;
            text = widgetNode.getElementsByClassName("city")[0].value;
            matchingCities = getMatchingCities(allCities, text);
            resetCityList(cityList);
            populateCityList(cityList);
            toggleFilteredCities(cityList, city);
            if (13 === parseInt(e.keyCode, 10)) {
                if (1 === matchingCities.length) {
                    selectCity(matchingCities.shift());
                    city.blur();
                }
            }
            return false;
        }

        function cityFocusClosure(widget) {
            return function () {
                cityFocus(widget);
            };
        }

        function cityBlurClosure(widget) {
            return function () {
                cityBlur(widget);
            };
        }

        function cityKeyDownClosure(widget) {
            return function () {
                cityKeyDown(widget);
            };
        }

        this.bind = function (cities, callback) {
            var widgets, i, l, widget, city;
            allCities = cities;
            matchingCities = cities;
            widgets = document.getElementsByClassName("h-city-widget");
            l = widgets.length;
            for (i = 0; i < l; i += 1) {
                widget = widgets[i];
                city = widget.getElementsByClassName("city")[0];
                city.value = blankInputMessage;
                city.addEventListener("focus", cityFocusClosure(widget), false);
                city.addEventListener("blur", cityBlurClosure(widget), false);
                city.addEventListener("keyup", cityKeyDownClosure(widget), false);
            }
            if (undefined !== callback) {
                citySelectedCallback = callback;
            }
        };

    };

});