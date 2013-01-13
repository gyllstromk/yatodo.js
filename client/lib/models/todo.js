(function(app) {
    DS.RESTAdapter.map('App.Todo', {
        primaryKey: '_id',
    });

    DS.RESTAdapter.registerTransform('array', {
        deserialize: function(serialized) {
            return serialized;
        },

        serialize: function(serialized) {
            return serialized;
        }
    });

    app.reopen({
        store: DS.Store.create({
            revision: 11
        })
    });

    app.Todo = DS.Model.extend({
        title: DS.attr('string'),
        completed: DS.attr('boolean'),
        tags: DS.attr('array'),
    });
})(window.App);
