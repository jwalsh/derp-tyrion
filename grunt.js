/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'tests/**/*.js']
    },
    qunit: {
      files: ['tests/**/*.html']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        sub: true,
        browser: true,
        scripturl: true
      },
      globals: {}
    },
    uglify: {}

  });

  grunt.registerTask(
    "testswarm",
    function( commit, configFile ) {
      var testswarm = require( "testswarm" ),
      testUrls = [],
      config = grunt.file.readJSON(configFile),
      tests = "core".split(" ");

      tests.forEach(
        function( test ) {
          testUrls.push( config.testUrl + commit + "/tests/index.html?module=" + test );
        });


      testswarm(
        {
          url: config.swarmUrl,
          pollInterval: 10000,
          timeout: 1000 * 60 * 30,
          done: this.async()
        },
        {
          authUsername: config.authUsername,
          authToken: config.authToken,
          jobName: 'Commit #<a href="#' + commit + '">' + commit.substr( 0, 10 ) + '</a>',
          runMax: config.runMax,
          "runNames[]": tests,
          "runUrls[]": testUrls,
          "browserSets[]": ["popular"]
        });
    });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min');

};
