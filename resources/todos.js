var sugar = require('sugar'),
    mongodb = require('mongodb');

if (! process.env.mongoUrl) {
    throw new Error('mongoUrl not specified.');
}

var url = process.env.mongoUrl;

module.exports = function(app) {
    app.get('/todos', function(req, res, next) {
        for (var key in req.query) {
            if (req.query[key] === 'true') {
                req.query[key] = true;
            } else if (req.query[key] === 'false') {
                req.query[key] = false;
            }
        }

        var page, page_size;

        if (req.query.page) {
            page = parseInt(req.query.page, 10) || 0;
            page_size = parseInt(req.query.page_size, 10) || 10;
        }

        delete req.query.page;
        delete req.query.page_size;

        require('mongodb').connect(url, function(err, connection) {
            connection.collection('todos', function(err, collection) {
                var cursor = collection.find(req.query);
//                 cursor.sort({ _id: -1 });
                cursor.sort({ created: -1 });
                if (typeof page !== 'undefined') {
                    cursor.skip(page_size * page).limit(page_size);
                }
                cursor.toArray(function(err, results) {
                    connection.close();
                    res.json({ todos: results });
                });
            });
        });
    });

    app.get('/todos/:id', function(req, res, next) {
        require('mongodb').connect(url, function(err, connection) {
            connection.collection('todos', function(err, collection) {
                collection.findOne({ _id: req.params.id }, function(err, obj) {
                    res.json({ todos: obj });
                    connection.close();
                });
            });
        });
    });

    app.post('/todos', function(req, res, next) {
        var todo = req.body;

        if (! todo.title) {
            return res.send(400, 'Missing title');
        }

        if (! todo.completed) {
            todo.completed = false;
        }

        if (! todo.created) {
            todo.created = Date.create();
        } else {
            todo.created = Date.create(todo.created);
        }

        require('mongodb').connect(url, function(err, connection) {
            connection.collection('todos', function(err, collection) {
                collection.save(todo, function(err, results) {
                    res.send(200, { todo: results });
                    connection.close();
                });
            });
        });
    });

    app.put('/todos/:id', function(req, res, next) {
        var todo = req.body;

        require('mongodb').connect(url, function(err, connection) {
            connection.collection('todos', function(err, collection) {
                todo._id = require('mongodb').ObjectID.createFromHexString(todo._id);
                todo.created = new Date(todo.created);
                collection.update({ _id: todo._id }, todo, function(err, result) {
                    collection.save(todo, function(err, result) {
                        res.send(200, { todo: todo });
                        connection.close();
                    });
                });
            });
        });
    });

//     app.put('/todos/:id', function(req, res, next) {
//         var todo = req.body.todo;
// 
//         mongo.removeById('todos', todo._id, function(result) {
//             mongo.save('todos', todo, function(results) {
//                 res.send(200, { todo: results });
//             });
//         });
//     });

    app.del('/todos/:id', function(req, res, next) {
        var id = require('mongodb').ObjectID.createFromHexString(req.params.id);

        require('mongodb').connect(url, function(err, connection) {
            connection.collection('todos', function(err, collection) {
                collection.remove({ _id: id }, function(err, result) {
                    res.send(200);
                    connection.close();
                });
            });
        });
    });

    app.put('/cleantodos', function(req, res, next) {
//         var id = require('mongodb').ObjectID.createFromHexString(req.params.id);

        require('mongodb').connect(url, function(err, connection) {
            connection.collection('todos', function(err, collection) {
                var cursor = collection.find(req.query);
                cursor.each(function(err, item) {
                });
                res.send(200);
            });
        });
    });
};
