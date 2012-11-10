App.Todo = DS.Model.extend({
    _id: DS.attr('string'),
    title: DS.attr('string'),
    tags: DS.attr('array'),
    completed: DS.attr('boolean'),
    created: DS.attr('date'),
    due: DS.attr('date'),

    didLoad: function() {
        // XXX hack to load
        App.entriesController.onLoaded();
    },

    didCreate: function() {
        // XXX hack to load
        App.entriesController.set('dirty', true);
//         App.entriesController.set('loaded', true);
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
