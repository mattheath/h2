'use strict';

define([
    'backbone',
    'moment',
    'uri/URI',
    'text!templates/user-page.html',
    'text!templates/user.html',
    'text!templates/edit-user.html'
], function (Backbone, moment, URI, pageTemplate, userTemplate, editTemplate) {

    var query = function(str) {
        var curURL = new URI();
        var q = curURL.search(true);
        if (str in q) { return q[str]; }
        return false;
    };

    return Backbone.View.extend({

        edit: false,

        initialize:  function(attr) {
            var that = this;
            this.options = attr || {};

            this.edit = query('edit') ? true : false;

            // set inert layout
            this.$el.html(_.template(pageTemplate, { application: this.model.get('application') }));

            this.model.on('change', function(ev) {
                that.render();
            });
            this.model.fetch()
                .catch(function(err) {
                    // error fetching user
                    that.options.showFailMessage(err);
                    $('a.edit').hide();
                    $('dl').hide();
                }).done();
        },

        render: function() {
            var that = this;

            var template;
            if (this.edit) {
                template = editTemplate;
            } else {
                template = userTemplate;
            }

            this.$('.user').html(
                _.template(template, {
                    user: this.model.toJSON(),
                    formatTime: function(ts) {
                        return moment(ts * 1000).format('HH:mm D MMM YYYY'); 
                    },
                    commaSepList: function(list) {
                        if (!list) return '';
                        return list.join(',');
                    }
                })
            );

            // bind the edit button
            this.$('a.edit').click(function(ev) {
                ev.preventDefault();

                // toggle editing status
                that.edit = !that.edit;
                that.render();
                if (!that.edit) {
                    that.model.fetch();
                }
            });

            // bind the expire password button
            this.$('button.expire-password').click(function(ev) {
                ev.preventDefault();
                that.expirePassword();
            });

            // bind the back button
            this.$('a.back').click(function(ev) {
                ev.preventDefault();
                that.options.router.navigate('/app/'+that.model.get('application').toLowerCase(), { trigger: true });
            });

            // bind the roles form
            this.$('form.update-roles').submit(function(ev) {
                ev.preventDefault();
                var rawRoles = that.$('form.update-roles textarea').val().split(/\r?\n/);
                var roles = [];
                for (var _i = 0; _i < rawRoles.length; _i++) {
                    var role = rawRoles[_i];
                    if (role.length > 0) {
                        roles.push(role);
                    }
                }
                
                that.updateRoles(roles);
            });

            // bind the ids form
            this.$('form.edit-ids').submit(function(ev) {
                ev.preventDefault();
                that.editIDs();
            });

            // bind the password form
            this.$('form.change-password').submit(function(ev) {
                ev.preventDefault();
                that.changePassword();
            });
        },

        editIDs: function() {
            var that = this;
            var req = {};
            _.each(this.$('form.edit-ids').serializeArray(), function(f) { req[f.name] = f.value; });
            if (req.ids.length > 0) {
                var ids = _.map(req.ids.split(','), function(i) { return i.trim(); });
                this.model.changeIDs(ids)
                    .catch(function(error) {
                        that.options.showFailMessage(error);
                    })
                    .then(function(resp) {
                        if (resp) {
                            that.options.showMessage('Updated user ids', 'success');
                        }
                    }).done();
            }
        },
        
        updateRoles: function(roles) {
            var that = this;
            this.model.updateRoles(roles)
                .catch(function(error) {
                    that.options.showFailMessage(error);
                })
                .done();
        },

        changePassword: function() {
            var that = this;
            var password = $('form.change-password #new-password').val().trim();
            var repeatedPassword = $('form.change-password #repeat-new-password').val().trim();

            if (password.length < 0) {
                this.options.showFailMessage('New password cannot be blank');
                return;
            }

            if (password != repeatedPassword) {
                this.options.showFailMessage(
                    'New password and confirmation new password do not match'
                );
                return;
            }

            this.model.changePassword(password)
                .catch(function(error) {
                    that.options.showFailMessage(error);
                })
                .then(function(resp) {
                    if (resp) {
                        that.options.showMessage('Changed password', 'success');
                    }
                })
                .done();
        },

        expirePassword: function() {
            var that = this;
            this.model.expirePassword()
                .catch(function(error) {
                    that.options.showFailMessage(error);
                })
                .then(function(resp) {
                    if (resp) {
                        that.options.showMessage('Expired password', 'success');
                    }
                })
                .done();
        }

    });
});
