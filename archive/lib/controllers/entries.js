var EntriesController = Ember.ArrayController.extend({
    tags: null,
    all: false,
    page: 0,
    loaded: false,
    entries: Ember.A(),

    sortProperties: ['created'],
    sortAscending: false,
    pageSize: 50,
    loadCount: 0,

    init: function() {
//         this._super();
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
        if (entries.length === this.get('pageSize') * 3) {
            this.set('dirty', true);
        }
    },

    _filtered: function() {
        var query = {};

        if (this.get('tags')) {
            query.tags = this.get('tags');
        }

        if (this.get('all')) {
            query.all = true;
        }

        var entries = this.get('entries');
        var content = [];
        var seen = 0;

        return entries.filter(function(each) {
            if (! query.hasOwnProperty('all') && each.get('completed')) {
                return false;
            }

            if (query.tags && (each.get('tags') || []).intersect(query.tags).length === 0) {
                return false;
            }

            return each;
        });

//         var content = App.store.filter(App.Todo, function(each) {
//         });

    }.property('entries', 'loaded', 'tags', 'all'),

    content: function() {
        var content = this.get('_filtered');
        if (! content) {
            return [];
        }

        content = content.toArray().sortBy('created', true);

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
