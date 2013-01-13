/*globals Ember,DS,console*/

(function(app) {
    'use strict';

    var identity = function(each) {
        return true;
    };

    var TodosController = Ember.ArrayController.extend({
        content: [],
        items: Ember.ArrayController.extend({
            init: function() {
                this.set('content', app.Todo.find());
            }
        }).create(),

        showAll: null,
        tagFilter: null,
        page: null,

        init: function() {
            this.set('showAll', false);
            this.set('page', 0);
        },

        applyFilter: function() {
            var showAll = this.get('showAll');
            var tagFilter = this.get('tagFilter');

            this.set('content', this.get('items.content').filter(function(each) {
                if (! showAll && each.get('completed')) {
                    return false;
                }

                if (tagFilter) {
                    if ((each.get('tags') || []).indexOf(tagFilter) === -1) {
                        return false;
                    }
                }

                return true;
            }));
        }.observes('showAll', 'tagFilter', 'page', 'items')
    });

    var todosController = TodosController.create();
    todosController.set('showAll', false);
//     todosController.get('items').pushObjects(app.Todo.find());
//     todosController.set('items', app.Todo.find());

    app.reopen({
        TodosRoute: Ember.Route.extend({
            model: function() {
                return todosController;
            },

            events: {
                setTagFilter: function(event) {
                    todosController.set('tagFilter', event);
                }
            }
        })
    });
})(window.App);

