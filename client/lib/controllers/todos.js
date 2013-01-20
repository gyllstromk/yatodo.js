/*globals Ember,console,$*/

(function(app) {
    'use strict';

    var TodosController = Ember.ArrayController.extend({
        content: [],
        showAll: false,
        searchQuery: '',
        page: 0,

        init: function() {
            var self = this;
            $.ajax({
                url: '/todos',
//                 url: '/todos?page=0&page_size=100',
                dateType: 'json'
            }).success(function(data) {
                self.get('content').pushObjects(data.todos.map(function(each) {
                    if (! each.title) {
                        each.title = 'empty';
                    }
                    return app.Todo.create(each);
                }));
            });
        },

        del: function(todo) {
            var self = this;
            $.ajax({
                url:         '/todos/' + todo.get('_id'),
                type:        'DELETE'
            }).success(function(response) {
                console.log('deleted', response);
                self.removeObject(todo);
            }).error(function(err) {
                console.log('err', err);
            });
        },

        update: function(todo) {
            var self = this;
            todo = todo.toModel();

            $.ajax({
                url:         '/todos/' + todo._id,
                dataType:    'json',
                contentType: 'application/json',
                type:        'PUT',
                data:        JSON.stringify(todo),
                processData: false
            }).success(function(response) {
                console.log('updated', response.todo);
            }).error(function(err) {
                console.log('err', err);
            });
        },

        pages: function() {
            var content = this.get('filteredContent.length');
            var pages = [];
            for (var i = 0; i < content / 20; i++) {
                pages.add({ number: i, isActive: i === this.get('page') });
            }

            return pages;
        }.property('filteredContent.length', 'page'),

        create: function(todo) {
            var self = this;

            $.ajax({

                url:         '/todos',
                dataType:    'json',
                contentType: 'application/json',
                type:        'POST',
                data:        JSON.stringify(todo.toModel()),
                processData: false

            }).success(function(response) {
                self.insertAt(0, app.Todo.create(response.todo));
            }).error(function(err) {
                console.log('err', err);
            });
        },

        filteredContent: function() {
            this.set('page', 0);
            var content = this.get('content');
            if (! this.get('showAll')) {
                content = content.filter(function(each) {
                    return ! each.completed;
                });
            }

            var query = this.get('searchQuery');
            if (query) {
                var terms = query.split(' ');
                var titleQuery = terms.filter(function(each) {
                    return each[0] !== '#';
                }).join(' ');

                var tags = terms.filter(function(each) {
                    return each[0] === '#';
                }).map(function(each) {
                    return each.slice(1);
                });

                content = content.filter(function(todo) {
                    var hasTags = tags.every(function(tag) {
                        return todo.tags.some(function(todoTag) {
                            return todoTag.startsWith(tag);
                        });
                    });

                    return todo.title.indexOf(titleQuery) !== -1 && hasTags;
                });
            }

            return content;
        }.property('content.@each', 'showAll', 'searchQuery', 'content.@each.completed'),

        arrangedContent: function() {
            var page = this.get('page');
            var pageSize = 20;
            return this.get('filteredContent').slice(page * pageSize, (page + 1) * pageSize);
        }.property('filteredContent.@each', 'page')
    });

    app.todosController = TodosController.create();

    app.reopen({
        TodosRoute: Ember.Route.extend({
            model: function() {
                return app.todosController;
            },

            events: {
                insertNewTodo: function() {
                    app.todosController.create(app.Todo.create({ title: 'New todo' }));
                },

                setPage: function(page) {
                    app.todosController.set('page', page.number);
                },

                edit: function(todo) {
                    todo.set('isEditing', true);
                },

                addTagQuery: function(tag) {
                    var query = app.todosController.get('searchQuery');
                    query += ' ' + '#' + tag;
                    app.todosController.set('searchQuery', query.trim());
                }
            }
        })
    });
})(window.App);

