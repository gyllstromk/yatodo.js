(function (app) {
    'use strict';

    app.Router.map(function (match) {
        this.resource('todos');
        this.route('settings');
    });

    app.IndexRoute = Ember.Route.extend({
        redirect: function () {
            this.transitionTo('todos');
        }
    });
})(window.App);

