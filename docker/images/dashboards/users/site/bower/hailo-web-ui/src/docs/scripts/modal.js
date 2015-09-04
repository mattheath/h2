/*global requirejs, require*/

"use strict";

require(["/scripts/widgets/modal/amd.js"], function(Modal) {
    var modal = new Modal({
        width               : 400,
        heading             : "<h3>Stop Statement Run</h3>",
        bodyHTML            : "<p>Confirming will stop this statement run until further notice.</p><p>CITY, DD, MM, YYYY</p>",
        submitButtonLabel   : "Confirm",
        submitAction        : function () {
            console.log("todo1");
            modal.close();
        }
    });
    modal.render();
});
