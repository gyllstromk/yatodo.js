require.config({
    baseUrl: 'javascripts',

    shim: {
        'ember': {
            deps: ['jquery', 'handlebars', 'sugar']
        },
        'ember-data': {
            deps: ['ember']
        }
    },

    paths: {
        text: '../assets/js/text',
        jquery: '../assets/js/jquery',
        ember: '../assets/js/libs/ember-1.0.pre',
        'ember-data': '../assets/js/libs/ember-data',
        handlebars: '../assets/js/libs/handlebars-1.0.0.beta.6',
        sugar: '../assets/js/sugar-1.3.1.min'
    }
});

define('app', ['app/views/application',
               'app/views/todos',
               'app/models',
               'app/controllers/entries',
               'app/router', 'ember', 'ember-data'],

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

    return window.Todos = App;
});
