App.Todo = DS.Model.extend({
    _id: DS.attr('string'),
    title: DS.attr('string'),
    tags: DS.attr('array'),
    completed: DS.attr('boolean'),
    created: DS.attr('date'),
    due: DS.attr('date'),

    didLoad: function() {
        // XXX hack to load
        App.entriesController.onLoaded(this);
    },

    didCreate: function() {
        // XXX hack to load
        console.log('created', this.get('created'));
//         App.store.load(this);
        App.entriesController.get('entries').insertAt(0, this);
        App.entriesController.set('dirty', true);
    }
});

DS.RESTAdapter.map('App.Todo', {
    primaryKey: '_id',
});

DS.RESTAdapter.registerTransform('array', {
    fromJSON: function(serialized) {
        return serialized;
    },
    toJSON: function(serialized) {
        return serialized;
    }
});

DS.RESTAdapter.registerTransform('date', {
    fromJSON: function(serialized) {
        if (serialized) {
            return Date.create(serialized);
        }
        return serialized;
    },

    toJSON: function(serialized) {
        return serialized;
    }
});

App.store = DS.Store.create({
    revision: 6,
    adapter: DS.RESTAdapter.create({})
});
