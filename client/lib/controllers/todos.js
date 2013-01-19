/*globals Ember,console,$*/

(function(app) {
    'use strict';

    var TodosController = Ember.ArrayController.extend({
        content: [],
        showAll: false,

        init: function() {
            var self = this;
            $.ajax({
                url: '/todos?page=0&page_size=10',
                dateType: 'json'
            }).success(function(data) {
                console.log(data.todos, typeof data.todos);
                console.log(Ember.A(data.todos));
                self.get('content').pushObjects(data.todos);
            });
        },

        create: function(todo) {
            var self = this;

            $.ajax({
                url: '/todos',
                dataType: 'json',
                type: 'POST',
                data: todo
            }).success(function(response) {
                self.insertAt(0, response.todo);
            }).error(function(err) {
                console.log('err', err);
            });
        },

        arrangedContent: function() {
            var content = this.get('content');
            if (! this.get('showAll')) {
                return content.filter(function(each) {
                    console.log('sup');
                    return ! each.completed;
                });
            }
            return content;
        }.property('content', 'showAll')


//         applyFilter: function() {
//             var showAll = this.get('showAll');
//             var tagFilter = this.get('tagFilter');
// 
//             this.set('content', this.get('items.content').filter(function(each) {
//                 if (! showAll && each.get('completed')) {
//                     return false;
//                 }
// 
//                 if (tagFilter) {
//                     if ((each.get('tags') || []).indexOf(tagFilter) === -1) {
//                         return false;
//                     }
//                 }
// 
//                 return true;
//             }));
//         }.observes('showAll', 'tagFilter', 'page', 'items', 'items.content.isLoaded', 'items.content.isUpdating')
    });

    app.todosController = TodosController.create();

    app.reopen({
        TodosRoute: Ember.Route.extend({
            model: function() {
                return app.todosController;
            },

            events: {
                setTagFilter: function(event) {
                    app.todosController.set('tagFilter', event);
                }
            }
        })
    });
})(window.App);

