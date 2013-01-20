/*globals Ember,DS,console*/
(function(app) {
    'use strict';

    app.SearchTextField = Ember.TextField.extend({
        classNames: [ 'search-query '],
        placeholder: 'Search ...',
        keyUp: function(event) {
            app.todosController.set('searchQuery', this.get('value'));
        }
    });

})(window.App);

