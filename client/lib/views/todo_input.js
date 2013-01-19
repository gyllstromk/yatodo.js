/*globals Ember,DS,console*/
(function(app) {
    'use strict';

    app.TextField = Ember.TextField.extend({
        insertNewline: function() {
            var todo = {};
            var tokens = this.get('value').split(' ');

            todo.tags = tokens.filter(function(each) {
                return each.startsWith('#');
            }).map(function(each) {
                return each.slice(1);
            });

            todo.title = tokens.filter(function(each) {
                return ! each.startsWith('#');
            }).join(' ');

            app.todosController.create(todo);
        }
    });
})(window.App);

