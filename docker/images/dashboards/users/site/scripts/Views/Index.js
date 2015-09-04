'use strict';

define([
    'underscore',
    'text!templates/index-page.html'
], function (_, indexTemplate) {
    
    var View = function(app) {
        this._app = app;
    };

    View.prototype.render = function() {
        this._app.renderPage('index', _.template(indexTemplate));
    };

    return View;
});
