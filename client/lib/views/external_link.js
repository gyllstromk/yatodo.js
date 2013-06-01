(function (App) {
    'use strict';

    App.ExternalLinkView = Ember.View.extend({
        tagName: 'span',
        click: function (event) {
            event.stopPropagation();
            window.open(this.get('href'));
        },

        template: Ember.Handlebars.compile('<span class="icon-file"></span>')
    });
})(window.App);

