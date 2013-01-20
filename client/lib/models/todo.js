(function(app) {
    'use strict';

    app.Todo = Ember.Object.extend({
        toModel: function() {
            return Object.select(this, 'title', 'created', 'completed', '_id',
                'tags');
        },

        isCompleted: function() {
            return this.get('completed');
        }.property('completed'),

        onUpdate: function() {
            if (! this.get('title').trim()) {
                app.todosController.del(this);
            } else {
                app.todosController.update(this);
            }
        }.observes('completed', 'title', 'tags')
    });
})(window.App);
