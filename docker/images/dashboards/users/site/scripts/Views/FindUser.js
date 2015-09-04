'use strict';

define([
    'underscore',
    'text!templates/find-page.html'
], function (_, findPageTemplate) {

    var View = function(application, app) {
        this._app = app;
        this._application = application;
    };

    View.prototype.render = function() {
        var that = this;

        // set the layout
        this._app.renderPage('find', _.template(findPageTemplate, { application: this._application }));

        // set the form submit behaviour
        $('form.find').submit(function(ev) {
            ev.preventDefault();
            var user = $('form.find input').val().trim();
            that._app.router.navigate('/app/'+that._application.toLowerCase()+'/users/'+user, { trigger: true });
        });

        // bind the back button
        $('a.back').click(function(ev) {
            ev.preventDefault();
            that._app.router.navigate('/app/'+that._application.toLowerCase(), { trigger: true });
        });
    };

    return View;
});
