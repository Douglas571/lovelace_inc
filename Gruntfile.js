module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-cafe-mocha')


  grunt.initConfig({
    jshint: {
      app: ['index.js']
    },
    cafemocha: {
      src: ['test/**/*.js']
    }
  })

  grunt.registerTask('default', ['cafemocha'])
}