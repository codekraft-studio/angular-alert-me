module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: '/**\n' +
    '* Package: <%= pkg.name %> - v<%= pkg.version %> \n' +
    '* Description: <%= pkg.description %> \n' +
    '* Last build: <%= grunt.template.today("yyyy-mm-dd") %> \n' +
    '* @author <%= pkg.author %> \n' +
    '* @license <%= pkg.license %> \n'+
    '*/\n',

    jshint: {
      options: {
        node: true,
        esversion: 6,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        browser: true,
        jasmine: true,
        globals: {
          angular: true,
          inject: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      source: {
        src: ['src/**/*.js', 'test/**/*.js']
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: ['src/alert-me.module.js', 'src/alert-me.*.js'],
        dest: 'dist/alert-me.js',
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        mangle: false,
      },
      my_target: {
        files: {
          'dist/alert-me.min.js': ['dist/alert-me.js']
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compact'
        },
        files: {
          'dist/alert-me.css': 'src/alert-me.scss'
        }
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      dist: {
        files: { '<%= concat.dist.dest %>': ['<%= concat.dist.dest %>'] }
      },
    },

    watch: {

      options: {
        livereload: true,
        spawn: false,
        interrupt: true
      },

      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:gruntfile']
      },

      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['newer:jshint', 'concat', 'uglify']
      },
      css: {
        files: ['src/**/*.scss'],
        tasks: ['sass']
      }

    },

    connect: {
      server: {
        options: {
          port: 9000,
          livereload: true,
          open: true,
          base: {
            path: '.',
            options: { index: 'example/index.html' }
          }
        }
      }
    },

    wiredep: {
      task: {
        src: ['example/index.html']
      }
    },

  });

  // Load vendor tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-newer');

  // default task
  grunt.registerTask('default', ['serve']);

  // build task (no watch)
  grunt.registerTask('build', ['jshint', 'concat', 'ngAnnotate', 'uglify']);

  // Start the development server
  grunt.registerTask('serve', ['wiredep', 'connect', 'watch']);

};
