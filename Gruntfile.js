module.exports = function(grunt) {
  [
    'grunt-cafe-mocha',
    'grunt-eslint',
    'grunt-nodemon',
    'grunt-contrib-watch',
    'grunt-concurrent'
  ].forEach( task => grunt.loadNpmTasks(task) )

  grunt.initConfig({
    eslint: {
      target: ['index.js', 'back-end/index.js']
    },
    cafemocha: {
      src: ['test/**/*.js']
    },
    watch: {
      scripts: {
        files: ['back-end/index.js'],
        tasks: ['eslint'],
        options: {
          spawn: false,
        },
      },
    },
    nodemon: {
      dev: {
        script: 'index.js'
      }
    },
    concurrent: {
      tasks: ['watch', 'nodemon'],
      options: {
        logConcurrentOutput: true
      } 
    }
  })

  grunt.registerTask('default', ['watch'])
  grunt.registerTask('dev', ['concurrent'])
}