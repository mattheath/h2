"use strict";

define([
    'backbone',
    'Services/Login'
], function(Backbone, LoginService){
    return Backbone.Model.extend({

        initialize: function(attr) {
            this.options = attr || {};
            this._loginService = new LoginService(this.options.api);
        },

        fetch: function() {
            var that = this;
            if (!this.has('uid') || !this.has('application')) {
                return;
            }
            var request = {};
            request.uid = this.get('uid');
            request.application = this.get('application');
            return this._loginService.readUser(request)
                .then(function(response) {
                    console.log('got a user', response);
                    that.set(response);
                });
        },

        changeIDs: function(ids) {
            if (!this.has('uid') || !this.has('application')) {
                return;
            }
            return this._loginService.changeIDs({
                uid: this.get('uid'),
                application: this.get('application'),
                ids: ids
            });
        },
        
        updateRoles: function(roles) {
            if (!this.has('uid') || !this.has('application')) {
                return;
            }
            
            return this._loginService.updateUserRoles({
                uid: this.get('uid'),
                application: this.get('application'),
                roles: roles
            });
        },

        changePassword: function(password) {
            if (!this.has('uid') || !this.has('application')) {
                return;
            }
            return this._loginService.changePassword({
                username: this.get('uid'),
                application: this.get('application'),
                newPassword: password
            });
        },

        expirePassword: function() {
            if (!this.has('uid') || !this.has('application')) {
                return;
            }
            return this._loginService.expirePassword({
                uid: this.get('uid'),
                application: this.get('application')
            });
        }
    });
});
