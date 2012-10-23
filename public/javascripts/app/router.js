define('app/router', function() {
    var makePageRoute = function(prefix) {
        if (! prefix) {
            prefix = '';
        }

        return Ember.Route.extend({
            showPage: Ember.Route.transitionTo('index.page'),

            filterBy: function() {
                return {};
            },

            index: Ember.Route.extend({
                route: '/',

                index: Ember.Route.extend({
                    route: '/',
                    
                    connectOutlets: function(router, context) {
                        console.log('heh');
                        router.send('showPage', { page: 0 });
                    }
                }),

                page: Ember.Route.extend({
                    route: prefix + '/:page',
                    connectOutlets: function(router, context) {
                        console.log('CNTXT', context);
                        var controller = router.get('namespace.entriesController');
                        console.log('CONTROLLER', controller);
                        controller.set('page', (context && context.page) || 0);
                        console.log(this);
    //                     controller.set('filterBy', App.filterController.get('filter'));
                        router.get('applicationController').connectOutlet('todos', controller);
                    }
                })
            })
        });
    };

    return Ember.Router.extend({
        enableLogging: true,

        page: function() {
            try {
                var page = this.get('location.lastSetURL').split('/').pop();
                console.log('router:page', page);
                return (page && parseInt(page, 10)) || 0;
            } catch (error) {
                return 0;
            }
        }.property('location.lastSetURL'),

        currentTag: function() {
            var url = this.get('location.lastSetURL').split('/');
            if (url[1] === 'tags') {
                return url[2];
            }
        }.property('currentState'),

        root: Ember.Route.extend({
            index: Ember.Route.extend({
                route: '/',
                connectOutlets: function(router, context) {
                    router.send('showTodos');
                }
            }),

            showTodos: function(router, context) {
                router.transitionTo('root.todos.index.page', { page: 0 });
            },

            todos: makePageRoute().extend({
                route: '/todos'
            }),

            showTags: function(router, context) {
                console.log('cntx', context);
                router.transitionTo('root.tags.index.page', Object.merge(context, {
                    page: 0 }));
            },

            tags: makePageRoute('/:tag').extend({
                route: '/tags',

                filterBy: function(context) {
                    return { tags: context.tag };
                }
            })
        })
    });
});