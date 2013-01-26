module.exports = function(grunt) {
    grunt.initConfig({
        handlebars_embed: {
            'public/application.js': [ 'client/lib/templates/*.handlebars' ]
        },

        concat: {
            dist: {
                src: [ 
                    'components/jquery/jquery.js',
                    'components/sugar/release/1.3.7/sugar-1.3.7.min.js',
                    'components/handlebars/handlebars-1.0.0-rc.1.js',
                    'components/bootstrap/docs/assets/js/bootstrap.js',
                    'vendor/ember.js/dist/ember.js',
                    'vendor/data/dist/ember-data.js',
                    'public/application.js',
                    'client/lib/app.js',
                    'client/lib/models/**.js',
                    'client/lib/router.js',
                    'client/lib/controllers/**.js',
                    'client/lib/views/**.js',
                ],
                dest: 'public/application.js'
            },
//             css: {
//                 src: [
//                     'components/bootstrap/docs/assets/css/bootstrap.css'
//                 ],
//                 dest: 'public/assets.css'
//             },
        },

        copy: {
            dist: {
                files: {
                    'public/': [ 'client/static/**' ]
                }
            },

            bootstrap: {
                files: {
                    'public/css/': [ 'components/bootstrap/docs/assets/css/*.css' ]
                }
            },

            images: {
                files: {
                    'public/img/': [ 'components/bootstrap/img/*' ]
                }
            }
        },

        watch: {
            scripts: {
                files: [ 'client/lib/**js', '<config:concat.dist.src>', 'resources/**js' ],
                tasks: 'handlebars_embed concat copy server'
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
    grunt.registerTask('dev', 'handlebars_embed concat copy server watch');
};
