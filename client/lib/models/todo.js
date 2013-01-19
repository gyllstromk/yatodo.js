(function(app) {
    'use strict';

    app.Todo = Ember.Object.extend({
        toModel: function() {
            var model = {};
            model.title = this.get('title');
            model.created = this.get('created');
            model.completed = this.get('completed');
            model._id = this.get('_id');
            model.tags = this.get('tags');
            return model;
        },

        isCompleted: function() {
            return this.get('completed');
        }.property('completed'),
    });
})(window.App);
