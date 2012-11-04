var EntriesController = Ember.ArrayController.extend({
    tags: null,

    active: false,
    page: 0,
    dirty: false,

    sortProperties: ['created'],
    sortAscending: false,

    init: function() {
        this.set('content', App.store.find(App.Todo, { page_size: 40 }));
        this._super();
    },

    _filter: function() {
        var query = {  page_size: 40 };
        if (this.get('tags')) {
            query.tags = this.get('tags');
        }

        if (this.get('active')) {
            query.completed = false;
        }

        this.set('content', App.store.filter(App.Todo, function(each) {
            if (query.hasOwnProperty('completed') && each.get('completed')) {
                return false;
            }

            if (query.tags && each.get('tags').intersect(query.tags).length === 0) {
                return false;
            }

            return true;
        }));
//         this.set('content', App.store.filter(query));
    }.observes('tags', 'active'),

//     arrangedContent: function() {
//         var content = [];
//         content.push(this.get('content.[]'));
//         if (content) {
//             console.log('sorting');
//             content.sortBy('_id');
//         }
// 
//         return content;
//     }.property(),

    replaceContent: function(idx, amt, objects) {
        var that = this;
        objects.forEach(function(entry) {
            App.store.createRecord(App.Todo, entry);
        });

        App.store.commit();
    },

    remove: function(todo) {
        todo.deleteRecord();
        App.store.commit();
    }
});

App.entriesController = EntriesController.create();

TodosController = TodosController.reopenClass({
    contentBinding: 'App.entriesController'
});
