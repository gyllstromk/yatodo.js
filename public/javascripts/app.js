var TodosController = Ember.ArrayController.extend({
//     sortProperties: ['created'],
//     sortAscending: false
});

var App = Em.Application.create({
    ApplicationController: Ember.Controller.extend(),
    ApplicationView: ApplicationView,
    Router: Router,
    TodosView: TodosView,
    TodosController: TodosController,
    todosController: TodosController.create(),
    Todo: Todo,
    entriesController: entries,
    rootElement: '#appapp',
//     ready: function() {
//         this.initialize();
//     }
});

TodosController = TodosController.reopenClass({
    contentBinding: 'App.entriesController'
});

window.Todos = App;
