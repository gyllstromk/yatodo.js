/*globals Ember,DS,console*/
(function(app) {
    'use strict';

    app.TextField = Ember.TextField.extend({
        focusOut: function() {
            this.set('content.isEditing', false);
        },

        value: function() {
            return this.get('content.title') + ' ' + (this.get('content.tags') || []).map(function(each) {
                return '#' + each;
            }).join(' ');
        }.property('title'),

        insertNewline: function() {
            var todo = this.get('content') || app.Todo.create();
            var tokens = this.get('value').split(' ');

            todo.set('tags', tokens.filter(function(each) {
                return each.startsWith('#');
            }).map(function(each) {
                return each.slice(1);
            }));

            todo.set('title', tokens.filter(function(each) {
                return ! each.startsWith('#');
            }).join(' '));

            if (todo.get('_id')) {
                if (! todo.get('title').trim()) {
                    app.todosController.del(todo);
                } else {
                    app.todosController.update(todo);
                }
            } else {
                app.todosController.create(todo);
            }

            todo.set('isEditing', false);
        }
    });
})(window.App);

