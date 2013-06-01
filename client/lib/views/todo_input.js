(function (app) {
    'use strict';

    app.TextField = Ember.TextField.extend({
        didInsertElement: function () {
            this.$().focus();
        },

        focusOut: function () {
            this.set('content.isEditing', false);
        },

        keyUp: function (event) {
            if (event.keyCode === 27) {
                this.set('content.isEditing', false);
            }
        },

        value: function () {
            var val = this.get('content.title');

//             var due = this.get('content.due');
//             if (due) {
//                 val += '@' + due;
//             }

            var tags = this.get('content.tags');
            if (tags) {
                val += ' ' + tags.map(function (each) {
                    return '#' + each;
                }).join(' ');
            }

            (this.get('content.links') || []).each(function (each) {
                val += ' ' + each;
            });

            return val;
        }.property('title'),

        insertNewline: function () {
            var tags = [];
            var title = '';
            var links = [];
            var due;

            this.get('value').split(' ').each(function (each) {
                if (each.startsWith('#')) {
                    tags.add(each.slice(1));
                } else if (each.startsWith('@')) {
                    if (each.length === 1) {
                        due = null;
                    } else {
                        due = Date.create(each.slice(1));
                    }
                } else if (/https{0,1}:\/\//.test(each)) {
                    links.add(each);
                } else {
                    title = (title + ' ' + each).trim();
                }
            });

            this.get('content').setProperties({
                tags: tags,
                title: title,
                due: due,
                links: links,
                isEditing: false
            });
        }
    });
})(window.App);

