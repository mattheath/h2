/*global define, document*/

define([], function () {

    "use strict";

    return function () {

        var that = this;

        function massApply(nodeList, fn, args) {
            var i;
            for (i = 0; i < nodeList.length; i += 1) {
                fn(nodeList[i]);
                fn.apply(undefined, [nodeList[i]].concat(args));
            }
        }

        function removeClass(node, c) {
            node.className = node.className.replace(new RegExp('\\b' + c + '\\b'), "");
        }

        function addClass(node, c) {
            node.className += " " + c;
            node.className = node.className.trim();
        }

        function hasClass(node, c) {
            return null !== node.className.match(new RegExp('\\b' + c + '\\b'));
        }

        function tabClick(node, options) {
            if (true === hasClass(node.parentNode, "selected")) {
                return false;
            }

            var index = parseInt(node.getAttribute("data-index"), 10);
            options = options || {};

            if (true === options.hasOwnProperty("loadTabContent")) {
                return options.loadTabContent.apply(that, [index]);
            } else {
                that.setActiveTab(index);
            }
            return false;
        }

        function tabClickClosure(anchor, options) {
            return function () {
                tabClick(anchor, options);
            };
        }

        this.setActiveTab = function (index) {
            var index = parseInt(index, 10),
                navItems = document.getElementsByClassName("h-tabs-navigation")[0].children,
                bodies = document.getElementsByClassName("h-tabs-contents")[0].children,
                l = bodies.length,
                l2 = navItems.length,
                i,
                anchor;
            for (i = 0; i < l; i += 1) {
                removeClass(bodies[i], "selected");
                bodies[i].style.visibility = "hidden";
                bodies[i].style.height = "0";
                bodies[i].style.display = "none";
            }
            for (i = 0; i < l; i += 1) {
                if (parseInt(bodies[i].getAttribute("data-index"), 10) === index) {
                    addClass(bodies[i], "selected");
                    bodies[i].style.visibility = "visible";
                    bodies[i].style.height = "auto";
                    bodies[i].style.display = "block";
                    continue;
                }
            }
            massApply(navItems, removeClass, ["selected"]);
            for (i = 0; i < l2; i += 1) {
                anchor = navItems[i].children[0];
                if (undefined !== anchor && parseInt(anchor.getAttribute("data-index"), 10) === index) {
                    addClass(navItems[i], "selected");
                    continue;
                }
            }
        };

        this.bind = function (options) {
            var nav, i, l, item, anchor;

            nav = document.getElementsByClassName("h-tabs-navigation")[0];
            l = nav.children.length;
            for (i = 0; i < l; i += 1) {
                item = nav.children[i];
                anchor = item.children[0];
                if (undefined !== anchor) {
                    anchor.addEventListener("click", tabClickClosure(anchor, options), false);
                }
            }
        };

    };

});