define('app', ['app/views/application',
               'app/views/todos',
               'app/models',
               'app/controllers/entries',
               'app/router'],

        function(ApplicationView,
                 TodosView,
                 models,
                 entries,
                 Router) {

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
        Todo: models.Todo,
        entriesController: entries,
        rootElement: '#appapp',
        ready: function() {
            this.initialize();
        }
    });

    TodosController = TodosController.reopenClass({
        contentBinding: 'App.entriesController'
    });

    return App;
});
