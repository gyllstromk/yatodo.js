/*globals Ember,Em*/

(function(app) {
    'use strict';

    app.PaginationView = Ember.ContainerView.extend({
        classNames: [ 'pagination' ],
        childViews: ['collectionView'],
        content: [1, 2, 3],

        collectionView: Ember.CollectionView.extend({
            tagName: 'ul',
            content: 'parentView.content',

            itemViewClass: Ember.View.extend({
                template: Em.Handlebars.compile('<a href="#">{{view.content}}</a>')
            })
        })
    });

//         
// <div class="pagination">
//   <ul>
//     <li><a href="#">Prev</a></li>
//     <li><a href="#">1</a></li>
//     <li><a href="#">2</a></li>
//     <li><a href="#">3</a></li>
//     <li><a href="#">4</a></li>
//     <li><a href="#">Next</a></li>
//   </ul>
// </div>

})(window.App);
