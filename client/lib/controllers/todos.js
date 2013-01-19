/*globals Ember,console,$*/

(function(app) {
    'use strict';

    var TodosController = Ember.ArrayController.extend({
        content: [],
        showAll: false,

        init: function() {
            var self = this;
            $.ajax({
                url: '/todos?page=0&page_size=10',
                dateType: 'json'
            }).success(function(data) {
                console.log(data.todos, typeof data.todos);
                console.log(Ember.A(data.todos));
                self.get('content').pushObjects(data.todos.map(function(each) {
                    console.log('each', Ember.Object.create(each));
                    return Ember.Object.create(each);
                }));
            });
        },

        toModel: function(todo) {
            var toModel = {};
            toModel.title = todo.get('title');
            toModel.created = todo.get('created');
            toModel.completed = todo.get('completed');
            toModel._id = todo.get('_id');
            toModel.tags = todo.get('tags');
            return toModel;
        },

        update: function(todo) {
            var self = this;
            console.log('creating', todo);
            todo = this.toModel(todo);

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
                data:        JSON.stringify(self.toModel(todo)),
                processData: false

            }).success(function(response) {
                console.log('inserting', response.todo);
                self.insertAt(0, Ember.Object.create(response.todo));
                console.log(self.get('content'));
            }).error(function(err) {
                console.log('err', err);
            });
        },

//         arrangedContent: function() {
//             console.log('heem');
//             var content = this.get('content');
//             if (! this.get('showAll')) {
//                 return content.filter(function(each) {
//                     return ! each.completed;
//                 });
//             }
//             return content;
//         }.property('content', 'showAll')
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
                    app.todosController.create(Ember.Object.create({ title: 'New todo' }));
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

