var EntriesController = Ember.ArrayController.extend({
    Todo: Todo,
    active: false,
    tags: null,

    page: 0,
    dirty: false,

//     sortProperties: ['created'],
//     sortAscending: false,

    init: function() {
        console.log('sssup');
        this._super();
    },

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

        var result = store.findQuery(this.get('Todo'), query);
        this.set('dirty', false);
        return result;
    }.property('page', 'tags', 'active', 'dirty'),

    replaceContent: function(idx, amt, objects) {
        var that = this;
        objects.forEach(function(entry) {
            console.log('envtry', entry);
            store.createRecord(that.get('Todo'), entry);
        });

        store.commit();
    },

    remove: function(todo) {
        todo.deleteRecord();
        store.commit();
        this.set('dirty', true);
    }
});

var entries = EntriesController.create();
