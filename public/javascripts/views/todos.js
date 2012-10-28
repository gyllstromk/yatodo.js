var TodosView = Ember.CollectionView.extend({
    contentBinding: 'controller.content',
    tagName: 'ul',

    change: function(evt) {
//             App.store.commit(); XXX
    },

    itemViewClass: Ember.View.extend({
        doubleClick: function() {
            this.set('editing', true);
        },

        TagView: Ember.View.extend({
            tagName: 'span',
            classNames: ['label'],
            template: Ember.Handlebars.compile('{{ tag.name }}'),
            click: function() {
//                     App.entriesController.set('tags', this.get('content.name'));
            }
        }),

        DueView: Ember.View.extend({
            tagName: 'span',
            classNameBindings: ['hasDueDate:icon-time'],
            mouseEnter: function() {
                var title = this.get('parentView.content.due');
                this.$().tooltip({ title: title.toString(), placement: 'right',
                    trigger: 'manual' });
                this.$().tooltip('show');
                return true;
            },
            mouseLeave: function() {
                this.$().tooltip('hide');
            },
            hasDueDate: function() {
                return typeof this.get('parentView.content.due') !== 'undefined';
            }.property()
        }),

        tags: function() {
            return [];
//             return [ { name: 'sup' } ];
//             return this.get('content').get('tags').map(function(entry) {
//                 return { name: entry };
//             });
        }.property('content.tags'),

        translate: function(name, value) {
            if (typeof value !== 'undefined') {
                console.log('Value', value);
                var todo = todoFromString(value);
                var content = this.get('content');
                console.log('title', todo.title, todo.tags);
                content.set('title', todo.title);
                content.set('tags', todo.tags);
                console.log('set content');
            } else {
                var tag_portion = this.get('content.tags').map(function(entry) {
                    return ':' + entry;
                }).join(' ');

                var datePortion = this.get('content.due');
                if (datePortion) {
                    datePortion = '@' + [datePortion.getMonth(), datePortion.getDay()].join('/') + '|' + [datePortion.getHours(), datePortion.getMinutes()].join(':');
                }

                return [this.get('content').get('title'), tag_portion, datePortion].join(' ');
            }
        }.property('content'),

        onFinish: function(a) {
            if (! this.get('editing')) {

                console.log(this.get('content').get('title'));
                if (this.get('content').get('title').trim() === '') {
                    var controller = this.get('controller');
                    App.entriesController.remove(this.get('content'));
                }
            }
        }.observes('editing'),

        classNameBindings: ['content.completed:completed'],
        templateName: 'todos',

        EditorView: Ember.TextField.extend({
//             value: function(name, value) {
//                 if (value) {
//                     return value;
//                 }
//             }.property('content.title'),
            update: function() {
                this.get('content').set('editing', false);
            },
            insertNewline: function() {
                console.log('whaa');
                this.update();
            },
            focusOut: function() {
                this.update();
            }
        })
    })
});
