module.exports = function(grunt) {
    grunt.initConfig({
        handlebars_embed: {
            'public/application.js': [ 'client/lib/templates/*.handlebars' ]
        },

        concat: {
            dist: {
                src: [ 
                    'vendor/jquery-1.8.0.js',
//                     'components/jquery/jquery.js',
                    'components/sugar/release/sugar-full.development.js',
                    'components/handlebars/handlebars.js',
                    'components/bootstrap/docs/assets/js/bootstrap.js',
//                     'vendor/ember.js/dist/ember.js',
                    'components/ember/ember.js',
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
                files: [ 'client/static/*', 'client/lib/templates/*.handlebars', 'client/lib/**/*js', 'resources/**js' ],
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
