/*globals Ember,console,$*/

(function(app) {
    'use strict';

    var TodosController = Ember.ArrayController.extend({
        content: [],
        showAll: false,
        searchQuery: '',
        page: 0,
        pageSize: 10,
        onlyDue: false,

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

        pageCount: function() {
            var content = this.get('filteredContent.length');
            return Math.ceil(content / this.get('pageSize'));
        }.property('filteredContent', 'pageSize'),

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
                todo = app.Todo.create(response.todo);
                self.insertAt(0, todo);
                todo.set('isEditing', true);
            }).error(function(err) {
                console.log('err', err);
            });
        },

        filteredContent: function() {
            var content = this.get('content');
            if (! this.get('showAll')) {
                content = content.filter(function(each) {
                    return ! each.completed;
                });
            }

            if (this.get('onlyDue')) {
                content = content.filter(function(each) {
                    return each.get('isDue');
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
        }.property('content.@each', 'onlyDue', 'showAll', 'searchQuery',
                'content.@each.completed', 'content.@each.tags'),

        resetPage: function() {
            this.set('page', 0);
        }.observes('searchQuery', 'showAll'),

        arrangedContent: function() {
            var page = this.get('page');
            return this.get('filteredContent').slice(page * this.get('pageSize'), (page +
                        1) * this.get('pageSize'));
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

                edit: function(todo) {
                    todo.set('isEditing', true);
                },

                toggleDateFilter: function(by) {
                    app.todosController.toggleProperty('onlyDue');
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

