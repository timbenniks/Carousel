/*global module:false, grunt:true*/
module.exports = function(grunt)
{
	"use strict";
	
	grunt.initConfig(
	{
		pkg: '<json:package.json>',
		
		meta:
		{
			banner:
			'/*!\n'+
			'*	@Class: <%= pkg.title || pkg.name %>\n'+
			'*	@Version: <%= pkg.version %>\n'+
			'*	@Created on: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
			'*	@Description: <%= pkg.description %>\n'+
			'*	@Author: <%= pkg.author.name %>\n'+
			' ---------------------------------------------------------------------------- */'
		},
		
		concat:
		{
			dist:
			{
				src: ['src/*.js'],
				dest: 'build/<%= pkg.name %>-<%= pkg.version %>.js'
			}
		},
		
		min:
		{
			dist:
			{
				src: ['<banner:meta.banner>', '<config:concat.js.dest>'],
				dest: 'build/<%= pkg.name %>-<%= pkg.version %>.min.js'
			}
		},
		
		lint:
		{
			files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
		},
		
		jshint:
		{
			options:
			{
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			
			globals:
			{
				jQuery: true
			}
		},
		
		uglify: {}
	});
	
	grunt.registerTask('default', 'lint concat');
};