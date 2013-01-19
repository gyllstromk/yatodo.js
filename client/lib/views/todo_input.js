/*globals Ember,DS,console*/
(function(app) {
    'use strict';

    app.TextField = Ember.TextField.extend({
        insertNewline: function() {
            var todo = this.get('content') || Ember.Object.create();
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
                app.todosController.update(todo);
            } else {
                app.todosController.create(todo);
            }

            todo.set('isEditing', false);
        }
    });
})(window.App);

