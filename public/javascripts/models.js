// 
// 
// DS.attr.transforms.array = {
//     from: function(serialized) {
//         return serialized;
//     },
//     to: function(serialized) {
//         return serialized;
//     }
// };

App.Todo = DS.Model.extend({
    _id: DS.attr('string'),
    title: DS.attr('string'),
    tags: DS.attr('array'),
    completed: DS.attr('boolean'),
    created: DS.attr('date'),
    due: DS.attr('date'),

//     didCreate: function() {
// //             App.entriesController.set('dirty', true);
//         console.log('Created!');
//     }
});

DS.RESTAdapter.map('App.Todo', {
    primaryKey: '_id',
//     tags: DS.attr('array'),
//     title: DS.attr('string'),
// //     tags: DS.attr('array'),
//     completed: DS.attr('boolean'),
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
