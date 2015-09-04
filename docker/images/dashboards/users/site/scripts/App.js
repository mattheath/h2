'use strict';

define([
    'backbone',
    'Router',
    'Services/Login',
    'Environment',
    'Models/User',
    'Collections/Users',
    'Views/Index',
    'Views/User',
    'Views/ListUsers',
    'Views/CreateUser',
    'Views/FindUser',
    'text!templates/message.html',
    'toastr'
], function (Backbone, Router, LoginService, Environment, UserModel, UsersCollection, IndexView, UserView, ListUsersView, CreateUserView, FindUserView, messageTemplate, toastr) {

    var App = function(webapp) {
        this.webapp = webapp;
        this.setEnvironmentName(new Environment(this.webapp.api).getName());
        this.loginService = new LoginService(this.webapp.api);
        this.router = new Router({ app: this });
        Backbone.history.start({ pushState: true })
    };

    App.prototype.renderIndex = function() {
        var v = new IndexView(this);
        v.render();
    };

    App.prototype.renderCreateUser = function(app) {
        var v = new CreateUserView(app, this);
        v.render();
    };

    App.prototype.renderFindUser = function(app) {
        var v = new FindUserView(app, this);
        v.render();
    };

    App.prototype.renderListUsers = function(app) {
        var v = new ListUsersView({
            collection:      new UsersCollection({ application: app, api: this.webapp.api }),
            el:              '#h-container #page',
            showMessage:     this.showMessage,
            showFailMessage: this.showFailMessage,
            router:          this.router
        });
        this.setPageClass('list');
        v.render();
    };

    App.prototype.renderViewUser = function(application, uid) {
        var v = new UserView({
            model:           new UserModel({ application: application, uid: uid, api: this.webapp.api }),
            el:              '#h-container #page',
            showMessage:     this.showMessage,
            showFailMessage: this.showFailMessage,
            router:          this.router
        });
        this.setPageClass('user');
        v.render();
    };

    App.prototype.setPageClass = function(name) {
        $('#h-container #page').attr('class', name);
    };

    App.prototype.renderPage = function(name, content) {
        this.setPageClass(name);
        $('#h-container #page').html(content);
    };

    App.prototype.showFailMessage = function(failResp) {
        if (failResp.message) {
            this.showMessage(failResp.message, 'error');
        }
        else if (failResp.APIError) {
            this.showMessage(failResp.APIError.message, 'error');
        }
        else {
            this.showMessage(failResp, 'error');
        }
    }

    App.prototype.showMessage = function(message, style) {
        toastr.options = {
            'positionClass': 'toast-top-full-width',
            'timeout': 300000,
            'extendedTimeOut': 30000
        };

        toastr[style](message, style.charAt(0).toUpperCase() + style.slice(1));
    };

    App.prototype.setEnvironmentName = function(env) {
        $('body > header .environment').html(' | '+env);
        document.title = 'Users | '+env;
    }

    return App;
});
