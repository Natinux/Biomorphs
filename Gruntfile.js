module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower: {
            install: {
                options: {
                    targetDir: 'client/libs',
                    layout: 'byComponent'
                }
            }
        },

        clean: {
            build: ['build'],
            js: ['public/js', 'public/libs'],
            css: ['public/styles', 'build/styles'],
            dev: {
                src: ['build', 'public']
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: 'client/styles/',
                src: ['*.css', '!*.min.css'],
                dest: 'build/styles/',
                ext: '.min.css'
            }
        },
      

        concat: {
            'public/styles/<%= pkg.name %>.min.css': ['build/styles/*.min.css']
        },

        copy: {
            prod: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'client/js/**/*.js',
                    dest: 'build/js/'
                },{
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src: 'client/libs/**/*.js',
                    dest: 'build/libs/'
                },{
                    expand: true,
                    flatten: true,
                    src: 'client/fonts/*',
                    dest: 'public/fonts/'
                }]
            },
            dev: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'client/js/**/*.js',
                    dest: 'public/js/'
                },{
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src: 'client/libs/**/*.js',
                    dest: 'public/libs/'
                },{
                    expand: true,
                    flatten: true,
                    src: 'client/fonts/*',
                    dest: 'public/fonts/'
                }]
            }
        },

        uglify: {
            compile: {
                options: {
                    compress: true,
                    verbose: true
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: 'build/js/**/*.js',
                    dest: 'public/js'
                },{
                    expand: true,
                    flatten: true,
                    src: 'build/libs/**/*.js',
                    dest: 'public/libs'
                }]
            }
        },

        // for changes to the front-end code
        watch: {
            scripts: {
                files: ['client/js/**/*.js'],
                tasks: ['clean:js', 'bower', 'copy:dev']
            },
            styles: {
                files: ['client/styles/**/*.css'],
                tasks: ['clean:css', 'cssmin', 'concat']
            }
        },

        // for changes to the node code
        nodemon: {
            dev: {
                options: {
                    file: 'index.js',
                    nodeArgs: ['--debug'],
                    watchedFolders: ['models', 'routes'],
                    env: {
                        PORT: '8080'
                    }
                }
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon:dev', 'watch:scripts', 'watch:styles'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }

    });

    grunt.registerTask('build:dev', ['clean', 'bower', 'cssmin', 'concat', 'copy:dev']);
    grunt.registerTask('build', ['clean', 'bower', 'cssmin', 'concat', 'copy:prod', 'uglify']);

    grunt.registerTask('server', ['build:dev', 'concurrent:dev']);
    grunt.registerTask('server:stage', ['build', 'concurrent:dev']);
};
