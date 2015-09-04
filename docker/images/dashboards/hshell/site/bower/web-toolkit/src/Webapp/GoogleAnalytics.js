 /* global ga */

'use strict';

define(['../Mixin/Events'], function(Events) {

    /**
     * Webapp tracking
     *
     * By default it tracks changes in the URL.
     */
    var Analytics = function() {

        Events.mixin(this);

        // Notice '//www' was replaced by 'https://' in order to make it work from
        // the file system
        /* jshint ignore:start */
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        /* jshint ignore:end */

        this.track('create', 'UA-23846614-7', {
            siteSpeedSampleRate: 100,
            alwaysSendReferrer: true
        });

        this._trackPageChanges();
        this._trackCurrentPage();
    };

    /**
     * Equivalent to the global ga() function Analytics creates.
     *
     * The point is that by using it you require a reference to this object so
     * you can be sure ga() is ready to be used.
     *
     * See https://developers.google.com/analytics/devguides/collection/analyticsjs/
     */
    Analytics.prototype.track = function() {
        ga.apply(null, arguments);
    };

    Analytics.prototype._trackCurrentPage = function() {
        var analytics = this;
        var currentPage = location.pathname + location.search + location.hash;
        if (currentPage == this._currentPage) return; // Don't track the same page twice in a row
        this._currentPage = currentPage;
        this.track('send', 'pageview', {
            page: currentPage,
            location: location.toString(),
            hitCallback: function() { analytics.trigger('sent'); }
        });
    };

    Analytics.prototype._trackPageChanges = function() {
        var analytics = this;
        if ('onpopstate' in window) {
            addEventListener('popstate', function() { analytics._trackCurrentPage(); });
        } else if ('onhashchange' in window) {
            addEventListener('hashchange', function() { analytics._trackCurrentPage(); });
        } else {
            setInterval(function() { analytics._trackCurrentPage(); }, 1000);
        }
    };

    return Analytics;
});
