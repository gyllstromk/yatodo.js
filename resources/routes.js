var path = require('path');

module.exports = function(app) {
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'jade');

    app.get('/', function(req, res) {
        res.render('index', { pretty: true });
    });
};
