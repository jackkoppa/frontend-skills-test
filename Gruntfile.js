module.exports = function(grunt) {
    // list of ES files that should be compiled by Babel
    var es6Files = [
        'dev/es6/config.js',
        'dev/es6/primary.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // take images from img/ directory, and create responsive versions
        // requires ImageMagick; download at https://www.imagemagick.org/script/download.php
        responsive_images: {
            dev: {
                options: {
                    engine: 'im',
                    sizes: [{
                        name: "480",
                        width: "480",
                        quality: 100
                    },{
                        name: "640",
                        width: "640",
                        quality: 100
                    },{
                        name: "900",
                        width: "900",
                        quality: 100
                    },{
                        name: "1200",
                        width: "1200",
                        quality: 100
                    }
                    ]
                },

                files: [{
                    expand: true,
                    cwd: 'dev/img',
                    src: ['**/*.jpg'],
                    dest: 'dev/img_responsive'
                }]
            }
        },

        // copy various files
        copy: {
            dev: {
                files: [
                    // copy over external scripts to avoid using Babel on them
                    {expand: true, cwd: 'dev/es6/external', src: '*.js', dest: 'dev/js/external'},

                    // copy any images "missed" (purposefully) by responsive_images task,
                    // into dev/img_responsive directory
                    {expand: true, cwd: 'dev/img', src: ['**/*.{png,gif,svg}'], dest: 'dev/img_responsive'}
                ]
            },
            prod: {
                files: [
                    // to make sure external js files are included in production, even though it's not compiled
                    {expand: true, cwd: 'dev/js/external', src: '*.js', dest: 'dist/js'},

                    // copy entire dev/img_responsive directory
                    {expand: true, cwd: 'dev/img_responsive', src: ['**/*','!**/*.db'], dest: 'dist/img_responsive'},

                    // copy entire fonts directory
                    {expand: true, cwd: 'dev/font', src: '**/*', dest: 'dist/font'}
                ]
            }
        },

        // compile .scss to .css
        sass: {
            dev: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: 'dev/scss',
                    src: ['*.scss','external/*.scss'],
                    dest: 'dev/css',
                    ext: '.css'
                }]
            },
            prod: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'dist/css/style.min.css': 'dev/scss/compiledStyle.scss',
                }
            }
        },

        // apply autoprefixes for older browsers
        postcss: {
            dev: {
                options: {
                    map: {
                        inline: false,
                        annotation: 'dev/css/maps/'
                    },

                    processors: [
                        require('autoprefixer')({browsers: 'last 2 versions'})
                    ]
                },
                src: 'dev/css/*.css'
            },
            prod: {
                options: {
                    map: false,

                    processors: [
                        require('autoprefixer')({browsers: 'last 2 versions'})
                    ]
                },
                src: 'dist/css/*.css'
            }
        },

        // concat js files, primarily for easy linting purposes (with all variables in same file)
        concat: {
            options: {
                separator: '\n'
            },

            // in development, this is just for easy linting. Task is also used in production build,
            // to create final minified .js file
            dev: {
                src: es6Files,
                dest: 'dev/es6/compiledScripts.js'
            }
        },

        // allow development using ES6
        babel: {            
            // all js development done within dev/es6 directory to use new features,
            // then compiled to dev/js for actual use in the browseer
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dev: {
                files: [{
                    expand: true,
                    cwd: 'dev/es6',
                    src: ['*.js'],
                    dest: 'dev/js',
                    ext: '.js'
                }]
            }
        },

        // clean various directories
        clean: {
            // to avoid confusion when developing, deletes the concatenated es6 file
            // & resume.js (from resume-data), after they are used by babel
            dev: ['dev/es6/compiledScripts.js'],

            // could be periodically run to clean out img_responsive directories,
            // which are not flushed on each run of the responsive_images task
            images: ['img','dev/img_responsive','dist/img_responsive'],

            // remove remaining "compiled" files, not covered above
            remaining: ['dist','dev/css','dev/js','.sass-cache']
        },

        // minify js files for production
        uglify: {
            options: {
                mangle: {
                    except: ['$']
                },
                compress: {
                    drop_console: true
                }
            },
            prod: {
                files: {
                    'dist/js/scripts.min.js': ['dev/js/compiledScripts.js']
                }
            }
        },

        // check the js output of babel
        // in the future, may make sense to check code *before* babel, which would entail using eslint
        // instead of jshint
        jshint: {
            options: {
                globals: {
                    "$": true,
                    "google": true
                },
                browser: true,
                devel: true,
                sub: true,
                strict: "global"
            },

            // for ease of comparing declared variables, only lints the concatenated file,
            // even though the development index.html is drawing from its source files for easy Chrome debugging
            dev: ['dev/js/compiledScripts.js']
        },

        // replaces links to dev js & css files, with links to single, minified files for production
        processhtml: {
            options: {
            },
            prod: {
                files: {
                    'dist/index.html': ['dev/index.html']
                }
            }
        },

        // simple http server that, paired with watch, is setup for livereload
        connect: {
            options: {
                hostname: 'localhost',
                livereload: 35729,
                open: true
            },
            dev: {
                options: {
                    port: 8000,
                    base: 'dev'
                }
            },
            prod: {
                options: {
                    port: 8080,
                    base: 'dist',
                    livereload: false,
                    keepalive: true
                }
            }
        },

        // tasks for modifying es6 & scss files, as well as livereloading dev server on changes
        watch: {
            options: {
                livereload: false
            },
            refresh: {
                files: ['dev/index.html','dev/js/*.js','dev/css/*.css'],
                options: {
                    livereload: true
                }
            },
            devJS: {
                files: 'dev/es6/*.js',
                tasks: ['copy:dev','concat','babel','clean:dev','jshint']
            },
            devSCSS: {
                files: ['dev/scss/*.scss'],
                tasks: ['sass:dev','postcss:dev']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-processhtml');

    // run all responsive image & compiling tasks, for both dev & production, without running servers
    grunt.registerTask('default', ['copy:dev','responsive_images','copy:prod','sass','postcss','concat','babel','clean:dev','uglify','jshint','processhtml']);
    
    // run all responsive image & compiling tasks for dev, then run a livereloading server
    grunt.registerTask('serveDev', ['copy:dev','responsive_images','sass:dev','postcss:dev','concat','babel','clean:dev','jshint','connect:dev','watch']);
    
    // run all responsive image & compiling tasks for prod, then run a perpetuating server (not livereload, but remains active after Grunt completes)
    grunt.registerTask('serveProd', ['copy:dev','responsive_images','copy:prod','sass:prod','postcss:prod','concat','babel','clean:dev','uglify','processhtml','connect:prod']);

    // can be periodically run to clean out img_responsive directories,
    // which are not flushed on each run of the responsive_images task
    grunt.registerTask('cleanImages', ['clean:images']);

    // to clean *everything* not included with the initial repo (allows testing build scripts from scratch)
    grunt.registerTask('cleanNuclear', ['clean:dev','clean:images','clean:remaining']);

};
