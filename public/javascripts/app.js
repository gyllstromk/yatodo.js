define('app', ['app/views/application', 'app/views/todos'], function(ApplicationView, TodosView) {
    var TodosController = Ember.ArrayController.extend({
    //     sortProperties: ['created'],
    //     sortAscending: false
    });

    var App = Em.Application.create({
        ApplicationController: Ember.Controller.extend(),
        ApplicationView: ApplicationView,
        TodosView: TodosView,
        TodosController: TodosController,
        todosController: TodosController.create(),
        rootElement: '#appapp',
        ready: function() {
            this.initialize();
        }
    });

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
                        var controller = App.entriesController;
                        controller.set('page', (context && context.page) || 0);
                        console.log(this);
    //                     controller.set('filterBy', App.filterController.get('filter'));
                        router.get('applicationController').connectOutlet('todos', controller);
                    }
                })
            })
        });
    };


    var Router = Ember.Router.extend({
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


    var store = DS.Store.create({
        revision: 4,
        adapter: DS.RESTAdapter.create({})
    });


    DS.attr.transforms.array = {
        from: function(serialized) {
            return serialized;
        },
        to: function(serialized) {
            return serialized;
        }
    };

    App.Todo = DS.Model.extend({
        primaryKey: '_id',
        title: DS.attr('string'),
        tags: DS.attr('array'),
        completed: DS.attr('boolean'),
        created: DS.attr('date'),
        due: DS.attr('date'),

        didCreate: function() {
            App.entriesController.set('dirty', true);
            console.log('Created!');
        }
    });

    var EntriesController = Ember.ArrayController.extend({
        Todo: App.Todo,
        active: false,
        tags: null,

        page: 0,
        dirty: false,

    //     sortProperties: ['created'],
    //     sortAscending: false,

        content: function() {
            console.log('here');
            var query = {};
            if (this.get('active')) {
                query.completed = false;
            }

            if (this.get('tags')) {
                query.tags = this.get('tags');
            }

            var defaultQuery = { page: this.get('page'), page_size: 40 };

            query = Object.merge(defaultQuery, query);

            var result = store.findQuery(this.get('Todo'), query);
            this.set('dirty', false);
            return result;
        }.property('page', 'tags', 'active', 'dirty'),

        replaceContent: function(idx, amt, objects) {
            var that = this;
            objects.forEach(function(entry) {
                console.log('envtry', entry);
                store.createRecord(that.get('Todo'), entry);
            });

            store.commit();
        },

        remove: function(todo) {
            todo.deleteRecord();
            store.commit();
            this.set('dirty', true);
        }
    });

    App.entriesController = EntriesController.create();
    TodosController = TodosController.reopenClass({
        contentBinding: 'App.entriesController'
    });


    App.Router = Router;
    return App;
});
