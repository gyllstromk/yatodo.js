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
    title: DS.attr('string'),
//     tags: DS.attr('array'),
    completed: DS.attr('boolean'),
//     created: DS.attr('date'),
//     due: DS.attr('date'),

//     didCreate: function() {
// //             App.entriesController.set('dirty', true);
//         console.log('Created!');
//     }
});

DS.RESTAdapter.map('App.Todo', {
    primaryKey: '_id',
    title: DS.attr('string'),
//     tags: DS.attr('array'),
    completed: DS.attr('boolean'),
});

App.store = DS.Store.create({
    revision: 6,
    adapter: DS.RESTAdapter.create({})
});
