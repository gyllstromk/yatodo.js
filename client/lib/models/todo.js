(function(app) {
    app.Todo = Ember.Object.extend({
        toModel: function() {
            var model = {};
            model.title = this.get('title');
            model.created = this.get('created');
            model.completed = this.get('completed');
            model._id = this.get('_id');
            model.tags = this.get('tags');
            return model;
        },

        isCompleted: function() {
            return this.get('completed');
        }.property(),
    });

//     DS.RESTAdapter.map('App.Todo', {
//         primaryKey: '_id',
//     });
// 
//     DS.RESTAdapter.registerTransform('array', {
//         deserialize: function(serialized) {
//             return serialized;
//         },
// 
//         serialize: function(serialized) {
//             return serialized;
//         }
//     });
// 
//     app.reopen({
//         store: DS.Store.create({
//             revision: 11
//         })
//     });
// 
//     app.Todo = DS.Model.extend({
//         title: DS.attr('string'),
//         completed: DS.attr('boolean'),
//         tags: DS.attr('array'),
//     });
})(window.App);
