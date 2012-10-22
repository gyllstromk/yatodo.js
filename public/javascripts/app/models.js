define('app/models', function() {
    var models = {};

    var store = DS.Store.create({
        revision: 4,
        adapter: DS.RESTAdapter.create({})
    });


    DS.attr.transforms.array = {
        from: function(serialized) {
            return serialized;
        },
        to: function(serialized) {
            return serialized;
        }
    };

    var Todo = DS.Model.extend({
        primaryKey: '_id',
        title: DS.attr('string'),
        tags: DS.attr('array'),
        completed: DS.attr('boolean'),
        created: DS.attr('date'),
        due: DS.attr('date'),

        didCreate: function() {
            App.entriesController.set('dirty', true);
            console.log('Created!');
        }
    });

    var EntriesController = Ember.ArrayController.extend({
        Todo: Todo,
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

    return EntriesController.create();
// 
//     return models;
});
