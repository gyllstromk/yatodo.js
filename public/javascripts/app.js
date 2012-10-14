var App = Em.Application.create({
    ApplicationController: Ember.Controller.extend(),
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


App.store = DS.Store.create({
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

        var result = App.store.findQuery(App.Todo, query);
        this.set('dirty', false);
        return result;
    }.property('page', 'tags', 'active', 'dirty'),

    replaceContent: function(idx, amt, objects) {
        objects.forEach(function(entry) {
            console.log('envtry', entry);
            App.store.createRecord(App.Todo, entry);
        });

        App.store.commit();
    },

    remove: function(todo) {
        todo.deleteRecord();
        App.store.commit();
        this.set('dirty', true);
    }
});

var TodosController = Ember.ArrayController.extend({
    contentBinding: 'App.entriesController'
//     sortProperties: ['created'],
//     sortAscending: false
});


App.entriesController = EntriesController.create();

App.TodosController = TodosController;
App.todosController = TodosController.create();


var Pagination = Ember.View.extend({
    classNames: ['pagination'],
    templateName: 'pagination',

    pages: function() {
        function makePageNav(pageno, title) {
            title = title || pageno;
            return { title: title, page: pageno };
        }

        var page = App.router.get('page');
        var pages = [];
        if (page > 0) {
            pages.add([makePageNav(page - 1, 'Prev'), makePageNav(page - 1)]);
        }

        pages.add([makePageNav(page + 1), makePageNav(page + 2), makePageNav(page + 1, 'Next')]);
        console.log(pages);
        return pages;
    }.property('App.router.page'),

    NavigationView: Ember.CollectionView.extend({
        contentBinding: 'view.pages',
        tagName: 'ul',
        itemViewClass: Ember.View.extend({
            click: function(event) {
                var context = { page: this.get('content.page') };
                if (App.router.get('currentState.parentState.parentState.name') === 'tags') {
                    var components = App.router.get('location.lastSetURL').split('/');
                    components.pop();
                    var tag = components.pop();
                    context.tag = tag;
                }

                console.log('context', context);
                App.router.send('showPage', context);
            },
            template: Ember.Handlebars.compile('<a>{{ view.content.title }}</a>')
        })
    })
});

var NavigationBar = Ember.View.extend({
    templateName: 'navigationbar',

    LinksView: Ember.CollectionView.extend({
        tagName: 'ul',
        classNames: ['nav'],
        content: ['all', 'tag:work'],

        itemViewClass: Ember.View.extend({
            isActive: function() {
                var title;

                if (this.get('content') === 'all') {
                    title = 'todos';
                } else if (this.get('content').startsWith('tag')) {
                    title = 'tags'; // XXX will break
                } else {
                    title = this.get('content');
                }

                console.log('title', title, App.router.get('currentState.parentState.parentState.name'));

                return App.router.get('currentState.parentState.parentState.name') === title;
            }.property('App.router.currentState'),

            classNameBindings: ['isActive:active'],
            title: function() {
                var title = this.get('content');
                if (title.indexOf(':') !== -1) {
                    title = title.split(':')[1];
                }

                return title[0].toUpperCase() + title.slice(1);
            }.property('content'),

            click: function() {
                var router = App.router;

                switch (this.get('content')) {
                    case 'all':
                        router.send('showTodos');
                        break;
                    default:
                        App.entriesController.set('tags', this.get('content').split(':')[1]);
                        break;
                }
            },

            template: Ember.Handlebars.compile('<a>{{ view.title }}</a>')
        })
    })
});

var TodosView = Ember.CollectionView.extend({
    contentBinding: 'controller.content',
    tagName: 'ul',

    change: function(evt) {
        console.log('www', this.get('content'));
        console.log(evt);
        App.store.commit();
    },

    itemViewClass: Ember.View.extend({
        doubleClick: function() {
            this.set('editing', true);
        },

        TagView: Ember.View.extend({
            tagName: 'span',
            classNames: ['label'],
            template: Ember.Handlebars.compile('{{ tag.name }}'),
            click: function() {
                App.entriesController.set('tags', this.get('content.name'));
            }
        }),

        DueView: Ember.View.extend({
            tagName: 'span',
            classNameBindings: ['hasDueDate:icon-time'],
            mouseEnter: function() {
                var title = this.get('parentView.content.due');
                this.$().tooltip({ title: title.toString(), placement: 'right',
                    trigger: 'manual' });
                this.$().tooltip('show');
                return true;
            },
            mouseLeave: function() {
                this.$().tooltip('hide');
            },
            hasDueDate: function() {
                return typeof this.get('parentView.content.due') !== 'undefined';
            }.property()
        }),

        tags: function() {
            return this.get('content').get('tags').map(function(entry) {
                return { name: entry };
            });
        }.property('content.tags'),

        translate: function(name, value) {
            if (typeof value !== 'undefined') {
                console.log('Value', value);
                var todo = todoFromString(value);
                var content = this.get('content');
                console.log('title', todo.title, todo.tags);
                content.set('title', todo.title);
                content.set('tags', todo.tags);
                console.log('set content');
            } else {
                var tag_portion = this.get('content.tags').map(function(entry) {
                    return ':' + entry;
                }).join(' ');

                var datePortion = this.get('content.due');
                if (datePortion) {
                    datePortion = '@' + [datePortion.getMonth(), datePortion.getDay()].join('/') + '|' + [datePortion.getHours(), datePortion.getMinutes()].join(':');
                }

                return [this.get('content').get('title'), tag_portion, datePortion].join(' ');
            }
        }.property('content'),

        onFinish: function(a) {
            if (! this.get('editing')) {

                console.log(this.get('content').get('title'));
                if (this.get('content').get('title') === '') {
                    var controller = this.get('controller');
                    App.entriesController.remove(this.get('content'));
                }
            }
        }.observes('editing'),

        classNameBindings: ['content.completed:completed'],
        templateName: 'todosTemplate',

        EditorView: Ember.TextField.extend({
//             value: function(name, value) {
//                 if (value) {
//                     return value;
//                 }
//             }.property('content.title'),
            update: function() {
                this.get('content').set('editing', false);
            },
            insertNewline: function() {
                console.log('whaa');
                this.update();
            },
            focusOut: function() {
                this.update();
            }
        })
    })
});

App.TodosView = TodosView;

function todoFromString(value) {
    var title = [], tags = [], due;

    value.split(' ').forEach(function(word) {
        if (word[0] === ':') {
            tags.pushObject(word.slice(1));
        } else if (word[0] === '@') {
            word = word.slice(1);
            var date, time;

            if (word.indexOf('|') !== -1) {
                var tokens = word.split('|');
                date = tokens[0];
                time = tokens[1];
            } else {
                date = word;
            }

            var dayMonth = date.split('/').map(function(token) {
                return parseInt(token, 10);
            });

            console.log('dayMonth', dayMonth);

            var hourMinute = time ? time.split(':').map(function(token) {
                return parseInt(token, 10);
            }) : null;

            if (dayMonth.length === 2) {
                due = new Date(new Date().getFullYear(), dayMonth[1] - 1, dayMonth[0]);

                if (due.isPast()) {
                    due = due.addYears(1);
                }
            } else {
                due = new Date(dayMonth);
            }

            if (hourMinute) {
                due = due.set({ hour: hourMinute[0], minute: hourMinute[1] });
                console.log(due);
            }
        } else {
            title.pushObject(word);
        }
    });

    var currentTag = App.get('router.currentTag');
    if (currentTag && tags.indexOf(currentTag) === -1) {
        tags.push(currentTag);
    }

    return { title: title.join(' '), tags: tags, due: due };
}

var ApplicationView = Ember.ContainerView.extend({
    childViews: [ 'navbarView', 'inputView', 'mainView', 'paginationView' ],

    navbarView: NavigationBar.create(),
    paginationView: Pagination.create(),

    inputView: Ember.View.create({
        childViews: ['TitleView', 'ActiveFilterView'],
        templateName: 'input',

        TitleView: Ember.TextField.extend({
            todosBinding: 'controller.namespace.todos',
            insertNewline: function() {
                var value = this.get('value');
                if (value) {
                    this.get('controller.namespace.todosController.content').pushObject(todoFromString(value));
                    this.set('value', '');
                }
            }
        }),

        TagFilterView: Ember.View.extend({
            contentBinding: 'App.entriesController.tags',
            tagName: 'span',
            isVisible: function() {
                return this.get('content') !== null;
            }.property('content'),

            template: Ember.Handlebars.compile('Tags: <span class="label">{{ view.content }}</span>'),
            click: function(event) {
                App.entriesController.set('tags', null);
            }
        }),

//         submit: Ember.View.create({
//             tagName: 'button',
//             classNames: ['btn btn-primary'],
//             template: Ember.Handlebars.compile('Add')
//         }),

        ActiveFilterView: Ember.Checkbox.extend({
             checkedBinding: 'App.entriesController.active'
        }),
    }),

    mainView: Ember.View.create({
        template: Ember.Handlebars.compile('{{outlet}}')
    })
});

App.ApplicationView = ApplicationView;

App.Router = Router;
