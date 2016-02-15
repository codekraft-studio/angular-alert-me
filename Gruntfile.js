module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watch: {

      scripts: {
        files: ['src/*.js'],
        tasks: ['concat', 'uglify']
      },
      css: {
        files: ['src/*.scss'],
        tasks: ['sass']
      }

    },

    concat: {
      dist: {
        src: ['src/alert-me.module.js', 'src/alert-me*.js'],
        dest: 'dist/alert-me.js',
      }
    },

    uglify: {
      options: { mangle: false },
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
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // default task
  grunt.registerTask('default', ['watch']);
};
