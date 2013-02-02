(function(app) {
    'use strict';

    app.Router.map(function(match) {
        this.route('todos', { path: '/todos' });
//         match('/todos').to('todos');
    });
})(window.App);

