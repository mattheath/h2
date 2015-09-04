'use strict';

define([
    'backbone',
    'toastr'
], function (Backbone, toastr) {
    var Router = Backbone.Router.extend({

        routes: {
            "app/:app/users/create" : "createUser",
            "app/:app/users/find"   : "findUser",
            "app/:app/users/:uid"   : "viewUser",
            "app/:app"              : "listUsers",
            "*actions"              : "index"
        },

        execute: function(callback, args) {
            // Clear all messages when changing pages.
            toastr.clear();
            if (callback) callback.apply(this, args);
        },

        initialize: function(options) {
            this._app = options.app;
        },

        index: function() {
            // default to the admin users page
            this.navigate('app/admin', { trigger: true });
        },

        createUser: function(app) {
            app = app.toUpperCase();
            this._app.renderCreateUser(app);
        },

        findUser: function(app) {
            app = app.toUpperCase();
            this._app.renderFindUser(app);
        },

        listUsers: function(app) {
            app = app.toUpperCase();
            this._app.renderListUsers(app);
        },

        viewUser: function(app, uid) {
            // assuming it's been lower-cased for the url
            app = app.toUpperCase();
            this._app.renderViewUser(app, uid);
        }
    });

    return Router;
});
