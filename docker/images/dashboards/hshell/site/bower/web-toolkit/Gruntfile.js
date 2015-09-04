"use strict";

module.exports = function (grunt) {

    grunt.initConfig({

        exec: {
            bower: {
                command: "node_modules/.bin/bower update --quiet"
            },

            'build-dist': {
                command: 'bin/build-dist'
            }
        },

        qunit: {
            unit: 'test/unit.html',
            functional: 'test/functional.html'
        },

        browserify: {
            standalone: {
                cwd: 'src',
                src: 'whatever', // Required but ignored
                dest: grunt.option('dest') || 'web-toolkit.js',
                options: {
                    transform: ['deamdify'],
                    alias: [
                        'build/shims/jquery.js:jquery',
                        'build/shims/q.js:q',
                        'build/shims/uri.js:uri/URI'
                    ],
                    aliasMappings: {
                        cwd: 'src',
                        src: '**/*.js',
                        dest: 'toolkit'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask("install", "exec:bower");

    grunt.registerTask('test:unit', 'qunit:unit');
    grunt.registerTask('test:func', 'qunit:functional');
    grunt.registerTask('test', 'qunit');

    // CI. See common/script/builders/web.sh
    grunt.registerTask('reset', []); 
    grunt.registerTask('build', ['install', 'test', 'exec:build-dist']); 

    grunt.registerTask(
        'build-standalone', 
        "Builds a standalone version accessible through e.g. `require('toolkit/H2/CallAPI')`. " +
            "Requires the dependencies to be already loaded.\n\n" +
            "Usage: grunt build-standalone [--dest=web-toolkit.js]",
        'browserify:standalone');
};
