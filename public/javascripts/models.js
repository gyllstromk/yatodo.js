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
//             App.entriesController.set('dirty', true);
        console.log('Created!');
    }
});
