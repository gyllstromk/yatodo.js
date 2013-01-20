(function(app) {
    'use strict';

    app.Router.map(function(match) {
        match('/todos').to('todos');
    });
})(window.App);

