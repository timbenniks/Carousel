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
			'*	@Description: <%= pkg.description %>\n'+
			'*	@Author: <%= pkg.author.name %>\n'+
			' ---------------------------------------------------------------------------- */'
		},
		
		concat:
		{
			dist:
			{
				src: ['src/*.js'],
				dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
			}
		},
		
		min:
		{
			dist:
			{
				src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
				dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
			}
		},

		qunit:
		{
			files: ['test/**/*.html']
		},
		
		lint:
		{
			files: ['grunt.js', 'src/**/*.js']
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
	
	grunt.registerTask('default', 'lint qunit');
	grunt.registerTask('deploy', 'lint qunit concat min');
};