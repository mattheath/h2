module.exports = function (grunt) {

    grunt.initConfig({

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**',
                    dest: '_site'
                }]
            }
        },

        connect: {
            server: {
                options: {
                    hostname: '*',
                    port: 9010,
                    middleware: function (connect) {
                        return [
                            connect.static(require('path').resolve('src'))
                        ];
                    }
                }
            }
        },

        watch: {
            src: {
                files: ['src/**', '!src/compiled/**', '!src/bower/**'],
                tasks: ['generateSite']
            }
        },

        sass: {
            main: {
                files: [{
                    'src/compiled/styles/main.css': 'src/styles/main.scss'
                }, {
                    'src/compiled/styles/main2.css': 'src/styles/main2.scss'
                }]
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask("generateSite", [
        'sass:main'
    ]);

    // start local development server
    grunt.registerTask('server', [
        'connect:server',
        'generateSite',
        'watch:src'
    ]);

    // build the site
    grunt.registerTask("build", [
        'generateSite',
        'copy:dist'
    ]);
};
