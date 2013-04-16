(function(app) {

    app.PaginationView = Ember.ContainerView.extend({
        classNames: [ 'pagination', 'pagination-centered' ],
        childViews: [ 'PageView' ],

        PageView: Ember.CollectionView.extend({
            tagName: 'ul',

            pageLeft: '«',
            pageRight: '»',

            content: function() {
                var range = 3;
                var pageCount = this.get('controller.pageCount');
                var page = this.get('controller.page');
                var numberToUse = Math.min(range * 2 + 1, pageCount);

                var start, end;
                range = Math.floor(numberToUse / 2);

                if (page - range < 0) {
                    start = 0;
                    end = numberToUse;
                } else if (page + range + 1 > pageCount) {
                    end = pageCount;
                    start = pageCount - numberToUse;
                } else {
                    start = page - range;
                    end = page + range + 1;
                }

                var pages = [ this.get('pageLeft') ];
                for (var i = start; i < end; i++) {
                    pages.add(i);
                }
                pages.add(this.get('pageRight'));

                return pages;
            }.property('controller.page', 'controller.pageCount'),

            setPage: function(page) {
                var current = this.get('controller.page');

                if (page === this.get('pageLeft')) {
                    page = Math.max(current - 1, 0);
                } else if (page === this.get('pageRight')) {
                    page = Math.min(current + 1, this.get('controller.pageCount') - 1);
                }

                this.set('controller.page', page);
            },

            itemViewClass: Ember.View.extend({
                classNameBindings: [ 'active' ],
                active: function() {
                    return this.get('controller.page') === this.get('content');
                }.property('controller.page'),

                template: Ember.Handlebars.compile('<a href="#" {{action setPage view.content target="view.parentView"}}>{{view.content}}</a>')
            })
        })
    });

}(window.App));
