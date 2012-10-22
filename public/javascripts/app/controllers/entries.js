define('app/controllers/entries', ['app/models'], function(models) {
    var EntriesController = Ember.ArrayController.extend({
        Todo: models.Todo,
        active: false,
        tags: null,

        page: 0,
        dirty: false,

    //     sortProperties: ['created'],
    //     sortAscending: false,

        content: function() {
            console.log('here');
            var query = {};
            if (this.get('active')) {
                query.completed = false;
            }

            if (this.get('tags')) {
                query.tags = this.get('tags');
            }

            var defaultQuery = { page: this.get('page'), page_size: 40 };

            query = Object.merge(defaultQuery, query);

            var result = models.store.findQuery(this.get('Todo'), query);
            this.set('dirty', false);
            return result;
        }.property('page', 'tags', 'active', 'dirty'),

        replaceContent: function(idx, amt, objects) {
            var that = this;
            objects.forEach(function(entry) {
                console.log('envtry', entry);
                models.store.createRecord(that.get('Todo'), entry);
            });

            models.store.commit();
        },

        remove: function(todo) {
            todo.deleteRecord();
            models.store.commit();
            this.set('dirty', true);
        }
    });

    return EntriesController.create();
});
