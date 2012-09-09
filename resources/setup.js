var express = require('express'),
    path = require('path');

module.exports = function(app) {
    app.configure(function() {
      app.set('port', process.env.PORT || 4000);
      app.use(express.favicon());
      app.use(express.logger('dev'));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(express.static(path.join(__dirname, '..', 'public')));
    });

    app.configure('development', function() {
      app.use(express.errorHandler());
    });
};
