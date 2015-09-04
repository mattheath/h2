'use strict';

define([
    'underscore',
    'text!templates/create-page.html'
], function (_, createPageTemplate) {

    var View = function(application, app) {
        this._app = app;
        this._application = application;
    };

    var _updateUsername = function _updateUsername() {
        var firstname = $('#firstname').val().replace(/\s/g, '').toLowerCase();
        var lastname = $('#lastname').val().replace(/\s/g, '').toLowerCase();
        var username = firstname + '.' + lastname;
        $('#uid').val(username);
        $('#uid_suggestion').text(username);

        if (username != '.') {
            $('#uid_suggestion_wrapper').slideDown();
        } else {
            $('#uid_suggestion_wrapper').slideUp();
        }
    };

    View.prototype.render = function() {
        var that = this;

        // set the layout
        var content = { application: this._application };
        this._app.renderPage('create', _.template(createPageTemplate, content));

        // Generate a username from first and last names.
        $('#firstname, #lastname').on('keyup change', _updateUsername);

        // set the form submit behaviour
        $('form.create').submit(function(ev) {
            ev.preventDefault();
            var req = {};
            _.each($(this).serializeArray(), function(f) { req[f.name] = f.value; });

            // unseparate the ids and roles -- ids are optional
            if (req.ids.length > 0) {
                req.ids = _.map(req.ids.split(','), function(i) { return i.trim(); });
            } else {
                delete req.ids;
            }
            req.roles = _.map(req.roles.split(','), function(i) { return i.trim(); });

            // check values aren't empty
            if (!_.every(_.flatten(_.values(req)), function(v) {
                if (v && v != '') { return true; }
                return false;
            })) {
                that._app.showFailMessage("Please complete all fields");
                return
            }

            // check the repeat-password
            if (req['repeat-password'] == '' || req['repeat-password'] != req.password) {
                that._app.showFailMessage("Passwords don't match");
                return
            }
            delete req['repeat-password'];

            // add created timestamp
            req.createdTimestamp = parseInt(Date.now() / 1000, 10);

            req.application = that._application;

            console.log('Creating user...', req);
            that.createUser(req).done();
        });

        // bind the back button
        $('a.back').click(function(ev) {
            ev.preventDefault();
            that._app.router.navigate('/app/'+that._application.toLowerCase(), { trigger: true });
        });
    };

    View.prototype.createUser = function(req) {
        var that = this;
        return this._app.loginService.createUser(req)
        .catch(function(err) {
            // Detect the unauthorised error by strcmp and force
            // login -- web-toolkit can't do this because the error
            // is a standard one.
            if (err.message == "Permission denied (unauthorised user)") {
                that._app.webapp.loginWebapp.login({ force: true })
                .then(function(resp) {
                    return that.createUser(req);
                })
                .done();
            } else {
                that._app.showFailMessage(err);
            }
        })
        .then(function(resp) {
            if (resp) {
                // User has been created, navigate to user page.
                var app = req.application.toLowerCase();
                that._app.router.navigate(
                    '/app/' + app + '/users/' + req.uid,
                    { trigger: true }
                );

                that._app.showMessage('Created user ' + req.uid, 'success');
            }
        })
    }

    return View;
});
