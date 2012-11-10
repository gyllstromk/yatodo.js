var EntriesController = Ember.ArrayController.extend({
    tags: null,
    active: false,
    page: null,
    loaded: false,
    entries: Ember.A(),

    sortProperties: ['created'],
    sortAscending: false,
    pageSize: 20,
    loadCount: 0,

    init: function() {
        this._super();
        App.store.find(App.Todo);
    },

    reload: function() {
        if (this.get('dirty')) {
//             App.store.find(App.Todo);
            this.set('dirty', false);
            this.set('loaded', false);
            this.set('loaded', true);
        }
    }.observes('dirty'),

    onLoaded: function(item) {
        var entries = this.get('entries');
        entries.pushObject(item);
        if (entries.length === this.get('pageSize')) {
            this.set('dirty', true);
        }
    },

    _filtered: function() {
        console.log('sdfs2111');
        var query = {};

        if (this.get('tags')) {
            query.tags = this.get('tags');
        }

        if (this.get('active')) {
            query.completed = false;
        }

        var entries = this.get('entries');
        var content = [];

        for (var i = 0; content.length < this.get('pageSize') && i < entries.length; i++) {
            var each = entries[i];

            console.log('each', each.get('title'));
            if (query.hasOwnProperty('completed') && each.get('completed')) {
                continue;
            }

            if (query.tags && (each.get('tags') || []).intersect(query.tags).length === 0) {
                continue
            }

            content.push(each);
        }

//         var content = App.store.filter(App.Todo, function(each) {
//         });

        return content;
    }.property('entries', 'loaded', 'tags', 'active'),

    content: function() {
        var content = this.get('_filtered');
        if (! content) {
            return [];
        }

        content = content.toArray().sortBy('created', true);
        console.log('content', content.slice(0, 20));

        return content.slice(0, this.get('pageSize'));
    }.property('_filtered'),

    replaceContent: function(idx, amt, objects) {
        var that = this;
        objects.forEach(function(entry) {
            entry.created = Date.create();
            App.store.createRecord(App.Todo, entry);
        });

        App.store.commit();
    },

    remove: function(todo) {
        console.log('deleting');
        this.get('entries').removeObject(todo);
        todo.deleteRecord();
        App.store.commit();
        this.set('dirty', true);
    }
});

App.entriesController = EntriesController.create();

TodosController = TodosController.reopenClass({
    contentBinding: 'App.entriesController'
});
