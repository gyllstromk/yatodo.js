/*globals Ember,console,$*/

(function(app) {
    'use strict';

    var TodosController = Ember.ArrayController.extend({
        content: [],
        showAll: false,
        page: 0,

        init: function() {
            var self = this;
            $.ajax({
                url: '/todos?page=0&page_size=100',
                dateType: 'json'
            }).success(function(data) {
                console.log(data.todos, typeof data.todos);
                console.log(Ember.A(data.todos));
                self.get('content').pushObjects(data.todos.map(function(each) {
                    if (! each.title) {
                        each.title = 'empty';
                    }
                    return app.Todo.create(each);
                }));
            });
        },

        del: function(todo) {
            console.log('deleting', todo.get('_id'));

            $.ajax({
                url:         '/todos/' + todo._id,
                type:        'DELETE'
            }).success(function(response) {
                console.log('deleted', response);
            }).error(function(err) {
                console.log('err', err);
            });
        },

        update: function(todo) {
            var self = this;
            console.log('creating', todo);
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
                console.log(self.get('content'));
            }).error(function(err) {
                console.log('err', err);
            });
        },

        create: function(todo) {
            var self = this;
            console.log('creating', todo);

            $.ajax({

                url:         '/todos',
                dataType:    'json',
                contentType: 'application/json',
                type:        'POST',
                data:        JSON.stringify(todo.toModel()),
                processData: false

            }).success(function(response) {
                console.log('inserting', response.todo);
                self.insertAt(0, app.Todo.create(response.todo));
                console.log(self.get('content'));
            }).error(function(err) {
                console.log('err', err);
            });
        },

        filteredContent: function() {
            var content = this.get('content');
            if (! this.get('showAll')) {
                return content.filter(function(each) {
                    return ! each.completed;
                });
            }
            return content;
        }.property('content', 'showAll'),

        arrangedContent: function() {
            var page = this.get('page');
            var pageSize = 20;
            return this.get('filteredContent').slice(page * pageSize, (page + 1) * pageSize);
        }.property('filteredContent')
    });

    app.todosController = TodosController.create();

    app.reopen({
        TodosRoute: Ember.Route.extend({
            model: function() {
                return app.todosController;
            },

            events: {
                insertNewTodo: function() {
                    console.log('ee');
                    app.todosController.create(app.Todo.create({ title: 'New todo' }));
                },

                sup: function(todo) {
                    todo.set('isEditing', true);
                    console.log('ssa');
                },

                setTagFilter: function(event) {
                    app.todosController.set('tagFilter', event);
                }
            }
        })
    });
})(window.App);

