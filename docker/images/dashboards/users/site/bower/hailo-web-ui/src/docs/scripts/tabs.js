/*global requirejs, require*/

"use strict";

require(["/scripts/widgets/tabs/amd.js"], function(Tabs) {
    (new Tabs()).bind({
        loadTabContent: function (index) {
            console.log(index);
            this.setActiveTab(index);
            return false;
        }
    });
});
