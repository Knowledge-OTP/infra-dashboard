// Generated on 2015-08-18 using generator-angular 0.12.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin',
        ngtemplates: 'grunt-angular-templates',
        cdnify: 'grunt-google-cdn'
    });

    // Configurable paths for the application
    var appConfig = {
        src: 'src',
        dist: 'dist',
        tmp: '.tmp',
        appName: 'znk.infra-dashboard'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: appConfig,
        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporterOutput: "",
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.src %>/**/*.js'
                ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= yeoman.tmp %>',
                        '<%= yeoman.dist %>/{,*/}*',
                        '!<%= yeoman.dist %>/.git{,*/}*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Automatically inject Bower components into the app
        wiredep: {
            demo: {
                options: {
                    fileTypes: {
                        html: {
                            replace: {
                                js: function (dest) {
                                    // debugger;
                                    var path = dest.replace('../../bower_components/', '');
                                    return '<script src="' + path + '"></script>';
                                },
                                css: function (dest) {
                                    // debugger;
                                    var path = dest.replace('../../bower_components/', '');
                                    return '<link rel="stylesheet" href="' + path + '" />';
                                }
                            }
                        }
                    }
                },
                src: 'demo/**/index.html'
            },
            test: {
                devDependencies: true,
                src: '<%= karma.unit.configFile %>',
                ignorePath: /\.\.\//,
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },
        concat: {
            mainModule: {
                //js files configuration is generated in prepareConfiguration
                files: [{
                    src: ['<%= yeoman.tmp %>/**/*.css'],
                    dest: '<%= yeoman.tmp %>/main.css'
                }]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/<%= yeoman.appName %>.min.js': '<%= yeoman.dist %>/<%= yeoman.appName %>.js'
                }
            }
        },
        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: '*.js',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        // Test settings
        karma: {
            unit: {
                browsers: [
                    'Chrome',
                    'Safari'
                ],
                configFile: 'test/karma-unit.conf.js'
            },
            ci: {
                configFile: 'test/karma-unit.conf.js',
                singleRun: true,
                browsers: ['Chrome']
            },
            build: {
                configFile: 'test/karma-unit.conf.js',
                singleRun: true,
                browsers: [
                    'Chrome'
                ]
            }
        },
        connect: {
            options: {
                base: ['.tmp', 'bower_components', 'demoShared'],
                open: true,
                livereload: 35731
            },
            serve: {
                options: {
                    port: 9002,
                    hostname: 'localhost'
                }
            }
        },
        watch: {
            options: {
                livereload: '<%= connect.options.livereload %>',
                host: 'localhost'
            },
            js: {
                files: [
                    'src/**/*.js'
                ],
                tasks: ['prepareConfiguration', 'concat:build', 'concat:mainModule']
            },
            html: {
                files: [
                    'src/**/*.{html,svg}'
                ],
                tasks: ['prepareConfiguration', 'html2js', 'concat:mainModule']
            },
            demo: {
                files: [
                    'demo/**/*.*'
                ]
            },
            sass: {
                files: [
                    'src/**/*.scss'
                ],
                tasks: ['sass', 'autoprefixer:main', 'concat:mainModule']
            },
            assets: {
                files: ['<%= yeoman.src %>/**/locale/*.json', '<%= yeoman.src %>/**/*.{png}'],
                tasks: ['copy:build']
            },
            wiredep: {
                files: ['bower.json'],
                tasks: ['wiredep']
            }
        },
        sass: {
            //options: {
            //    sourceMap: true
            //},
            //allComponenets: {
            //    files: [{
            //        expand: true,
            //        cwd: '<%= yeoman.src %>/components',
            //        src: '**/main.scss',
            //        dest: '<%= yeoman.tmp %>/',
            //        ext: '.css'
            //    }]
            //}
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    '.tmp/main.css': 'src/scss/main.scss'
                }
            }
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.src %>/components',
                    src: '*/locale/*.*',
                    dest: '<%= yeoman.tmp %>'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.src %>/components',
                    src: '*/assets/**/*.*',
                    dest: '<%= yeoman.tmp %>'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.src %>/components/',
                    src: '*/assets/**/*.*',
                    dest: '<%= yeoman.tmp %>/assets',
                    rename: function (dest, src) {
                        var indexOfAssets = src.indexOf('assets');
                        var destSuffix = src.substr(indexOfAssets + 7);
                        return '.tmp/assets/' + destSuffix;
                    }
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.tmp %>/',
                    src: ['**/*.*', '!**/*.js'],
                    dest: '<%= yeoman.dist %>/'
                }, {
                    '<%= yeoman.dist %>/main.js': '<%= yeoman.tmp %>/main.js',
                    '<%= yeoman.dist %>/main.css': '<%= yeoman.tmp %>/main.css'
                }]
            }
        },
        html2js: {
            options: {
                module: appConfig.appName,
                singleModule: true,
                existingModule: true
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            main: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.tmp %>/',
                    src: ['**/*.css'],
                    dest: '<%= yeoman.tmp %>/'
                }]
            }
        }
    });

    grunt.registerTask('test', [
        'wiredep',
        'karma:unit'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('ci', function () {
        grunt.task.run([
            'jshint:all',
            'karma:ci'
        ]);
    });

    grunt.registerTask('serve', function (component) {
        if (component) {
            var additionalBase = 'demo/' + component;
            console.log('serving also from', additionalBase);
            var connectConfig = grunt.config('connect');
            connectConfig.options.base.push(additionalBase);
            grunt.config('connect', connectConfig);
        }
        console.log('serving from', grunt.config('connect').options.base);
        grunt.task.run([
            'build',
            'wiredep',
            'connect:serve',
            'watch'
        ]);
    });

    grunt.registerTask('prepareConfiguration', 'preparing html2js and concat configuration for each component', function () {
        var concat = grunt.config.get('concat') || {};

        var jsMainModuleFilesSrcArr = ['<%= yeoman.src %>/core/module.js'];
        concat.mainModule.files.push({
            src: jsMainModuleFilesSrcArr,
            dest: '<%= yeoman.tmp %>/main.js'
        });

        concat.build = {
            files: []
        };
        concat.dist = {
            files: []
        };

        var html2js = grunt.config.get('html2js') || {};

        grunt.file.expand("src/components/*").forEach(function (dir) {
            // get the module name from the directory name
            var dirName = dir.substr(dir.lastIndexOf('/') + 1);

            html2js[dirName] = {
                options: {
                    module: appConfig.appName + '.' + dirName,
                    base: 'src'
                },
                src: [dir + '/**/*.{html,svg}'],
                dest: '<%= yeoman.tmp %>/' + dirName + '/templates.js'
            };

            // create a subtask for each module, find all src files
            // and combine into a single js file per component
            concat.build.files.push({
                src: [dir + '/module.js', dir + '/**/*.js'],
                dest: '.tmp/' + dirName + '/' + dirName + '.js'
            });

            var componentPathInTmp = '.tmp/' + dirName + '/';
            concat.dist.files.push({
                src: [componentPathInTmp + dirName + '.js', componentPathInTmp + 'templates.js'],
                dest: 'dist/' + dirName + '/' + dirName + '.js'
            });

            jsMainModuleFilesSrcArr.push(componentPathInTmp + dirName + '.js', componentPathInTmp + 'templates.js');
        });
        // add module subtasks to the concat task in initConfig
        grunt.config.set('html2js', html2js);
        grunt.config.set('concat', concat);
    });

    grunt.registerTask('build', [
        'clean:server',
        'prepareConfiguration',
        'sass',
        'autoprefixer:main',
        'html2js',
        'concat:build',
        'concat:mainModule',
        'copy:build',
        'ngAnnotate'
    ]);

    grunt.registerTask('dist', [
        'jshint:all',
        'karma:build',
        'clean:dist',
        'build',
        'copy:dist',
        'concat:dist'
    ]);
};
