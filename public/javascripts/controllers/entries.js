var EntriesController = Ember.ArrayController.extend({
    tags: null,
    active: false,
    page: null,
    loaded: false,

    sortProperties: ['created'],
    sortAscending: false,
    pageSize: 20,
    loadCount: 0,

    init: function() {
        App.store.find(App.Todo);
        this._super();
    },

    reload: function() {
        if (this.get('dirty')) {
            App.store.find(App.Todo);
            this.set('dirty', false);
            this.set('loaded', false);
            this.set('loaded', true);
        }
    }.observes('dirty'),

    onLoaded: function() {
        if (! this.get('loaded')) {
            this.set('loadCount', this.get('loadCount') + 1);
            if (this.get('loadCount') === this.get('pageSize')) {
                this.set('loaded', true);
            }
        }
    },

    _filtered: function() {
        var query = {};

        if (this.get('tags')) {
            query.tags = this.get('tags');
        }

        if (this.get('active')) {
            query.completed = false;
        }

        var content = App.store.filter(App.Todo, function(each) {
            if (query.hasOwnProperty('completed') && each.get('completed')) {
                return false;
            }

            if (query.tags && (each.get('tags') || []).intersect(query.tags).length === 0) {
                return false;
            }

            return true;
        });

        return content;
    }.property('loaded', 'tags', 'active'),

    content: function() {
        var content = this.get('_filtered');
        if (! content) {
            return [];
        }
        console.log('content', content.slice(0, 20));

        return content.slice(0, this.get('pageSize'));
    }.property('_filtered'),

    replaceContent: function(idx, amt, objects) {
        var that = this;
        objects.forEach(function(entry) {
            App.store.createRecord(App.Todo, entry);
        });

        App.store.commit();
    },

    remove: function(todo) {
        console.log('deleting');
        todo.deleteRecord();
        App.store.commit();
    }
});

App.entriesController = EntriesController.create();

TodosController = TodosController.reopenClass({
    contentBinding: 'App.entriesController'
});
