'use strict';

define(['src/Warning'], function(Warning) {

    module('Warning');

    test('It passes data and errors', function() {
        var error = new Error;
        var warning = new Warning({data: 'data', error: error});
        equal(warning.data, 'data');
        equal(warning.error, error);
    });

    test('thenIgnore() returns the warning data', function() {
        var warning = new Warning({data: 'data', error: new Error});
        equal(Warning.thenIgnore(warning), 'data');
    });

    test('thenIgnore() throws other errors', function() {
        throws(function() { Warning.thenIgnore(new Error); });
    });
});
