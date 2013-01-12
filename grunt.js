module.exports = function(grunt) {
    grunt.initConfig({
        handlebars_embed: {
            'public/application.js': [ 'client/lib/templates/*.handlebars' ]
        },

        bowerful: {
            store: 'components',
            dest: 'public',
            packages: {
                sugar: '',
                jquery: '~1.3.8',
                bootstrap: '~2.2.1'
            }
        },

        concat: {
            dist: {
                src: [ 
                       'components/handlebars/handlebars-1.0.0-rc.1.js',
                       'components/ember/ember.js',
                       'public/assets/js/libs/ember-data.js',
                       'public/application.js',
                       'client/lib/views/todoFromString.js',
                       'client/lib/views/todos.js',
                       'client/lib/views/application.js',
                       'client/lib/router.js',
                       'client/lib/app.js',
                       'client/lib/models.js',
                       'client/lib/controllers/entries.js',
                ],
                dest: 'public/application.js'
            }
        },

        watch: {
            scripts: {
                files: [ '<config:concat.dist.src>', 'resources/**js', 'app.js' ],
                tasks: 'handlebars_embed concat server'
            }
        }
    });

    grunt.registerTask('server', 'start server', function() {
        require('./app');
    });

    grunt.loadNpmTasks('grunt-bowerful');
    grunt.loadNpmTasks('grunt-emberify');
    grunt.registerTask('default', 'bowerful handlebars_embed concat');
    grunt.registerTask('dev', 'bowerful handlebars_embed concat server watch');
};
