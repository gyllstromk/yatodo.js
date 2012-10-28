var EntriesController = Ember.ArrayController.extend({
    active: false,
    tags: null,

    page: 0,
    dirty: false,

//     sortProperties: ['created'],
//     sortAscending: false,

    init: function() {
        console.log('sssup');
//         this.set('content', [ { title: 'sup' } ]);
//         this.set('content', App.store.findAll(App.Todo));
//         this.get('content').forEach(function(each) {
//             console.log('eeee', each);
//         });
        this._super();
    },

    content: function() {
        return App.store.findQuery(App.Todo, { page: 0 });
    }.property(),

//         console.log('here');
//         var query = {};
//         if (this.get('active')) {
//             query.completed = false;
//         }
// 
//         if (this.get('tags')) {
//             query.tags = this.get('tags');
//         }
// 
//         var defaultQuery = { page: this.get('page'), page_size: 40 };
// 
//         query = Object.merge(defaultQuery, query);
// 
//         var result = store.findQuery(this.get('Todo'), query);
//         this.set('dirty', false);
//         return result;
//     }.property('page', 'tags', 'active', 'dirty'),

    replaceContent: function(idx, amt, objects) {
        var that = this;
        objects.forEach(function(entry) {
            console.log('envtry', entry);
            App.store.createRecord(that.get('Todo'), entry);
        });

        App.store.commit();
    },

    remove: function(todo) {
        todo.deleteRecord();
        App.store.commit();
        this.set('dirty', true);
    }
});

App.entriesController = EntriesController.create();

TodosController = TodosController.reopenClass({
    contentBinding: 'App.entriesController'
});
