
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: 'public/src/js/*.js',
        dest: 'public/js/script.min.js'
      },
      dev: {
      	options: {
      		beautify: true,
      		mangle: false,
      		compress: false,
      		preserveComments: 'all'
      	},
      	src: 'public/src/js/*.js',
        dest: 'public/js/script.min.js'
      }
    },
    sass: {
    	dev: {
    		options: {
    			outputStyle: 'expanded'
    		},
    		files: {
    			'public/css/style.css' : 'public/src/scss/style.scss'
    		}
    	},
    	build: {
    		options: {
    			outputStyle: 'compressed'
    		},
    		files: {
    			'public/css/style.css' : 'public/src/scss/style.scss'
    		}
    	}
    },
    postcss: {
	    options: {
	      map: true, // inline sourcemaps
	      processors: [
	        require('pixrem')(), // add fallbacks for rem units
	        require('autoprefixer-core')({browsers: 'last 2 versions'}), // add vendor prefixes
	        require('cssnano')() // minify the result
	      ]
	    },
	    build: {
	      src: 'css/*.css'
	    }
  	},
  	watch: {
  		js: {
  			files: ['public/src/js/*.js'],
  			tasks: ['uglify:dev']
  		},
  		css: {
  			files: ['public/src/scss/**/*.scss'],
  			tasks: ['sass:dev']
  		}
  	},
    htmllint: {
      options: {},
      src: ['*.html'],
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-htmllint');

  // Default task(s).
  grunt.registerTask('default', ['uglify:dev', 'sass:dev', 'htmllint']);
  grunt.registerTask('build', ['uglify:build', 'postcss:build']);

};

