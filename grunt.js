module.exports = function(grunt) {
    grunt.initConfig({
        handlebars_embed: {
            'public/application.js': [ 'client/lib/templates/*.handlebars' ]
        },

        concat: {
            dist: {
                src: [ 
                       'components/jquery/jquery.js',
                       'components/handlebars/handlebars-1.0.0-rc.1.js',
                       'vendor/ember.js/dist/ember.js',
                       'vendor/data/dist/ember-data.js',
                       'public/application.js',
                       'client/lib/app.js',
                       'client/lib/router.js',
                       'client/lib/views/**.js',
                       'client/lib/models/**.js',
                       'client/lib/controllers/**.js',
                ],
                dest: 'public/application.js'
            }
        },

        copy: {
            dist: {
                files: {
                    'public/': [ 'client/static/*' ]
                }
            }
        },

        watch: {
            scripts: {
                files: [ 'client/lib/templates/**', '<config:concat.dist.src>', 'resources/**js' ],
                tasks: 'handlebars_embed concat server'
            }
        }
    });

    grunt.registerTask('server', 'start server', function() {
        require('./app');
    });

//     grunt.loadNpmTasks('grunt-bowerful');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-emberify');
    grunt.registerTask('default', 'handlebars_embed concat copy');
    grunt.registerTask('dev', 'handlebars_embed concat server watch');
};
