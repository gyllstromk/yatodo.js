/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http');

var app = express();

require('./resources/setup')(app);
require('./resources/routes')(app);
require('./resources/todos')(app);

// XXX app can listen; why use http?

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
