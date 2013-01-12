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
    rootElement: '#appapp',
//     ready: function() {
//         this.initialize();
//     }
});

window.Todos = App;
