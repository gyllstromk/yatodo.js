var NavigationBar = Ember.View.extend({
    templateName: 'navigationbar',
//         template: Ember.Handlebars.compile(todos),

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

//                     console.log('title', title, App.router.get('currentState.parentState.parentState.name'));

                return false;
//                     return App.router.get('currentState.parentState.parentState.name') === title;
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
//                             App.entriesController.set('tags', this.get('content').split(':')[1]);
                        break;
                }
            },

            template: Ember.Handlebars.compile('<a>{{ view.title }}</a>')
        })
    })
});

    var Pagination = Ember.View.extend({
        classNames: ['pagination'],
        templateName: 'pagination',

        pages: function() {
            function makePageNav(pageno, title) {
                title = title || pageno;
                return { title: title, page: pageno };
            }

            var page = 0; // App.router.get('page'); XXX
            var pages = [];
            if (page > 0) {
                pages.add([makePageNav(page - 1, 'Prev'), makePageNav(page - 1)]);
            }

            pages.add([makePageNav(page + 1), makePageNav(page + 2), makePageNav(page + 1, 'Next')]);
            return pages;
        }.property('App.router.page'),

        NavigationView: Ember.CollectionView.extend({
            contentBinding: 'view.pages',
            tagName: 'ul',
            itemViewClass: Ember.View.extend({
                click: function(event) {
                    var context = { page: this.get('content.page') };
//                     if (App.router.get('currentState.parentState.parentState.name') === 'tags') {
//                         var components = App.router.get('location.lastSetURL').split('/');
//                         components.pop();
//                         var tag = components.pop();
//                         context.tag = tag;
//                     }

                    this.set('controller.namespace.entriesController.page', context.page);
//                     console.log('context', context);
//                     App.router.send('showPage', context);
                },
                template: Ember.Handlebars.compile('<a>{{ view.content.title }}</a>')
            })
        })
    });

var ApplicationView = Ember.ContainerView.extend({
    childViews: ['navbarView', 'inputView', 'mainView',  'paginationView'],

    navbarView: NavigationBar.create(),
    paginationView: Pagination.create(),

    inputView: Ember.ContainerView.create({
        childViews: ['TitleView', 'TagFilterView', 'ActiveFilterView'],

        TitleView: Ember.TextField.extend({
            todosBinding: 'controller.namespace.todos',
            insertNewline: function() {
                var value = this.get('value');
                if (value) {
                    this.get('controller.namespace.entriesController').pushObject(todoFromString(value));
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

        ActiveFilterView: Ember.View.extend({
            defaultTemplate: Ember.Handlebars.compile('Show all: {{view view.IsActiveView}}'),
            IsActiveView: Ember.Checkbox.extend({
                checkedBinding: 'App.entriesController.all'
            }),
        }),
    }),

    mainView: Ember.View.create({
        template: Ember.Handlebars.compile('{{outlet}}')
    })
});
