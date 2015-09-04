'use strict';

define([
    '../../Mixin/Events',
    '../Repository'
], function(Events, Repository) {

    /**
     * @param {Webapp/Login} webapp
     */
    var Overlay = function(webapp) {
        Events.mixin(this);
        this._webapp = webapp;
        this._loginWebappName = webapp.isVPN() ? 'vpn-login' : 'login';
    };

    Overlay.prototype.show = function() {
        var overlay = this;
        if (this._element) return; // It's already visible
        this._element = document.createElement('iframe');
        this._element.id = 'hailo-login-frame';
        this._element.style.position = 'absolute';
        this._element.style.top = 0;
        this._element.style.left = 0;
        this._element.style.width = '100%';
        this._element.style.height = '100%';
        this._element.style.border = 0;
        this._element.style.zIndex = 9999;
        new Repository(this._webapp.api).get(this._loginWebappName).then(function(loginWebapp) {
            if (!overlay._element) return; // It has already been hidden
            overlay._element.src = loginWebapp.getUrl() +
                '?mechanism=' + encodeURIComponent(overlay._webapp.mechanism) +
                '&application=' + encodeURIComponent(overlay._webapp.application) +
                '&device-type=' + encodeURIComponent(overlay._webapp.deviceType) +
                '&api-url=' + encodeURIComponent(overlay._webapp.api.getBaseURL());
            document.body.appendChild(overlay._element);
            overlay.trigger('shown');
        });
    };

    Overlay.prototype.hide = function() {
        if (!this._element) return; // It's already hidden
        if (this._element.parentNode) this._element.parentNode.removeChild(this._element);
        this._element = null;
    };

    return Overlay;
});
