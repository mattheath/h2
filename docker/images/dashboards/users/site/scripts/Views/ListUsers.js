'use strict';

define([
    'backbone',
    'uri/URI',
    'datetimepicker',
    'text!templates/list-page.html',
    'text!templates/list-applications.html',
    'text!templates/list-options.html',
    'text!templates/list.html',
    'moment'
], function (Backbone, URI, datetimepicker, pageTemplate, applicationsTemplate, optionsTemplate, listTemplate, moment) {

    var qStrDateTmpl = 'YYYY-MM-DD-HHmm';

    // fetch dates from query string, if set
    var queryDateTime = function(key) {
        var curURL = new URI();
        var query = curURL.search(true);
        if (key in query) {
            var datetime = moment(query[key], qStrDateTmpl, true);
            if (datetime.isValid()) {
                return datetime.unix();
            }
        }
        return false;
    };

    var query = function(str) {
        var curURL = new URI();
        var q = curURL.search(true);
        if (str in q) { return q[str]; }
        return false;
    };

    var oneMonthAgo = function() {
        var oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
        return Math.round(oneMonthAgo / 1000);
    };

    return Backbone.View.extend({

        initialize:  function(attr) {
            var that = this;
            this.options = attr || {};
            this.options.possibleApplications = [ 'ADMIN', 'CUSTOMER', 'DRIVER' ];

            // set inert layout
            this.$el.html(_.template(pageTemplate));

            this.collection.on('reset', function(ev) {
                that.render();
            });

            // search range
            var rangeStart = queryDateTime('from');
            var rangeEnd = queryDateTime('to');
            // If no other options on load, show past day
            if (!rangeStart) {
                rangeStart = oneMonthAgo();
            }
            if (!rangeEnd) {
                rangeEnd = Math.round(Date.now() / 1000);
            }
            // initial search request
            this.options.rangeStart = rangeStart;
            this.options.rangeEnd = rangeEnd;
            this.collection.setSearchOptions({
                'rangeStart': rangeStart,
                'rangeEnd': rangeEnd
            });

            // enable/disable paginator
            this.collection.on('reset', function() {
                if (!that.collection.hasPrev()) {
                    $('.paginator .prev').addClass('h-button-disabled');
                } else {
                    $('.paginator .prev').removeClass('h-button-disabled');
                }
                if (!that.collection.hasNext()) {
                    $('.paginator .next').addClass('h-button-disabled');
                } else {
                    $('.paginator .next').removeClass('h-button-disabled');
                }
            });

            this.fetchUsers();
        },

        fetchUsers: function() {
            var that = this;
            this.collection.fetch()
                .catch(function(err) {
                    that.showFailMessage(err);
                })
                .done();
        },

        render: function() {
            var that = this;

            this.renderApplications();
            this.renderOptions();
            this.renderUsers();

            // navigate to create page
            this.$('.create').click(function(ev) {
                ev.preventDefault();
                var app = that.collection.getSearchOptions().application.toLowerCase();
                that.options.router.navigate('/app/'+app+'/users/create', { trigger: true });
            });

            // navigate to find page
            this.$('.find').click(function(ev) {
                ev.preventDefault();
                var app = that.collection.getSearchOptions().application.toLowerCase();
                that.options.router.navigate('/app/'+app+'/users/find', { trigger: true });
            });

            // navigate to user page on row click
            this.$('tr').click(function(ev) {
                ev.preventDefault();
                var $target = $(ev.target);
                var uid = $target.data('uid');
                if (_.isUndefined(uid)) {
                    var $tr = $target.parent('tr');
                    uid = $tr.data('uid');
                }
                var app = that.collection.getSearchOptions().application.toLowerCase();
                that.options.router.navigate('/app/'+app+'/users/'+uid, { trigger: true });
            });
        },

        renderApplications: function() {
            var that = this;
            this.$('.applications').html(
                _.template(applicationsTemplate, {application: this.collection.getSearchOptions().application, possibleApplications: this.options.possibleApplications})
            );
            // navigate on applications select change
            this.$('.applications select').change(function(ev) {
                ev.preventDefault();
                var app = that.$('#application :selected').val().toLowerCase();
                that.options.router.navigate('/app/'+app, { trigger: true });
            });
        },

        renderOptions: function() {
            var that = this;
            this.$('.options').html(
                _.template(optionsTemplate, {application: this.collection.getSearchOptions().application, possibleApplications: this.options.possibleApplications, options: this.collection.getSearchOptions()})
            );
            // reload list on options form submit
            this.$('.options form').submit(function(ev) {
                ev.preventDefault();
                var $table = $('.users table');

                $table.addClass('loading');

                var q = {};
                _.each($(this).serializeArray(), function(f) { q[f.name] = f.value; });

                var inputTmpl = 'YYYY/MM/DD HH:mm';
                var rangeStart = moment(q['range-start'], inputTmpl, true);
                var rangeEnd = moment(q['range-end'], inputTmpl, true);

                if (rangeStart.isValid() && rangeEnd.isValid()) {
                    that.collection.setSearchOptions({
                        rangeStart: rangeStart.unix(),
                        rangeEnd: rangeEnd.unix()
                    });
                    that.fetchUsers();
                    that.collection.resetPagination();

                    // set query string
                    var qStrTmpl = 'YYYY-MM-DD-HHmm';
                    var uri = new URI();
                    uri.setSearch({
                        'from' : rangeStart.format(qStrTmpl),
                        'to' : rangeEnd.format(qStrTmpl),
                    });
                    window.history.pushState({}, "", uri.href());
                } else {
                    $table.removeClass('loading');
                }
            });

        },

        renderUsers: function() {
            var that = this;
            this.$('.users').html(
                _.template(listTemplate, {users: this.collection.toJSON() })
            );

            // setup form values
            var rangeStartTimepickerOpts = { format: 'Y/m/d H:i' };
            if (this.options.rangeStart) {
                rangeStartTimepickerOpts.value = moment(this.options.rangeStart * 1000).format('YYYY/MM/DD HH:mm');
            }
            this.$('#range-start').datetimepicker(rangeStartTimepickerOpts);
            var rangeEndTimepickerOpts = { format: 'Y/m/d H:i' };
            if (this.options.rangeEnd) {
                rangeEndTimepickerOpts.value = moment(this.options.rangeEnd * 1000).format('YYYY/MM/DD HH:mm');
            }
            this.$('#range-end').datetimepicker(rangeEndTimepickerOpts);

            // paginator
            this.$('.paginator .prev').click(function(ev) {
                ev.preventDefault();
                that.collection.paginatePrev();
            });
            this.$('.paginator .next').click(function(ev) {
                ev.preventDefault();
                that.collection.paginateNext();
            });
        }
    });
});
