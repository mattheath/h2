"use strict";

define([
    'backbone',
    'Models/User',
    'Services/Login'
], function(Backbone, UserModel, LoginService){

    var oneDayAgo = function() {
        var oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        return Math.round(oneDayAgo / 1000);
    };

    return Backbone.Collection.extend({
        model: UserModel,

        initialize: function(attr) {
            this.options = attr || {};
            this._searchOptions = {
                'application': this.options.application.toUpperCase(),
		'count': 50
            };
            this._loginService = new LoginService(this.options.api);
            this._fetchedPages = [];
            this._currentPage = 0;
            this._paginationEnabled = false;
        },

        parse: function(response) {
            if (response && 'users' in response) {
                return response.users;
            }
            return [];
        },

        fetch: function(req, clear) {
            var that = this;            
            var request = req || {};
            if (clear) {
                this._fetchedPages = [];
                this._currentPage = 0;
            }

            return this._loginService.listUsers(_.defaults(request, this._searchOptions))
                .then(function(response) {
                    if (response) {
                        // store request, lastID
                        that._request = request;
                        that._lastID = response.lastId;

                        // update the collection
                        that.reset(that.parse(response));

                        // add new collection to pagination stack
                        that._fetchedPages.push(that.toJSON());
                    }
                });
        },       

        getSearchOptions: function() {
            return this._searchOptions;
        },

        setSearchOptions: function(opts) {
            this._searchOptions = _.defaults(opts, this._searchOptions);
        },

        resetPagination: function() {
            this._fetchedPages = [];
            this._currentPage = 0;
            this._paginationEnabled = true;
        },

        hasPrev: function() {
            if (this._currentPage > 0) {
                return true;
            }
            return false;
        },

        hasNext: function() {
            if (this.length == 50) {
                return true;
            }
            return false;
        },

        paginatePrev: function() {
            if (this.hasPrev()) {
                this._currentPage--;
                this.reset(this._fetchedPages[this._currentPage]);
            }
        },

        paginateNext: function() {
            this._paginationEnabled = false;
            var that = this;
            if (this.hasNext()) {
                this._currentPage++;
                // either use a page from the stack
                if (this._fetchedPages.length > 0 && this._currentPage < (this._fetchedPages.length)) {
                    this.reset(this._fetchedPages[this._currentPage]);
                    this._paginationEnabled = true;
                } else {
                    // or fetch another page
                    this.fetch(_.defaults({
                        lastId: this._lastID
                    }, this._request))
                    .done(function() {
                        that._paginationEnabled = true;
                    });
                }
            }
        }
    });
});
