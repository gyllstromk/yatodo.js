/*globals Ember,DS,console*/
(function(app) {
    'use strict';

    app.TextField = Ember.TextField.extend({
        focusOut: function() {
            this.set('content.isEditing', false);
        },

        keyUp: function(event) {
            if (event.keyCode === 27) {
                this.set('content.isEditing', false);
            }
        },

        value: function() {
            var val = this.get('content.title');

//             var due = this.get('content.due');
//             if (due) {
//                 val += '@' + due;
//             }

            var tags = this.get('content.tags');
            if (tags) {
                val += ' ' + tags.map(function(each) {
                    return '#' + each;
                }).join(' ');
            }

            return val;
        }.property('title'),

        insertNewline: function() {
            var tags = [];
            var title = '';
            var due;

            this.get('value').split(' ').each(function(each) {
                if (each.startsWith('#')) {
                    tags.add(each.slice(1));
                } else if (each.startsWith('@')) {
                    if (each.length === 1) {
                        due = null;
                    } else {
                        due = Date.create(each.slice(1));
                    }
                } else {
                    title = (title + ' ' + each).trim();
                }
            });

            this.get('content').setProperties({
                tags: tags,
                title: title,
                due: due,
                isEditing: false
            });
        }
    });
})(window.App);

