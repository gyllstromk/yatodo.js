(function (app) {
    'use strict';

    app.Router.map(function (match) {
        this.resource('todos');
        this.route('settings');
    });
})(window.App);

