var sugar = require('sugar'),
    mongodb = require('mongodb');

var url = 'mongodb://127.0.0.1:27018/todosback';

module.exports = function(app) {
    app.get('/todos', function(req, res, next) {
        for (var key in req.query) {
            if (req.query[key] === 'true') {
                req.query[key] = true;
            } else if (req.query[key] === 'false') {
                req.query[key] = false;
            }
        }

        var page = parseInt(req.query.page, 10) || 0;
        var page_size = parseInt(req.query.page_size, 10) || 10;

        delete req.query.page;
        delete req.query.page_size;

        require('mongodb').connect(url, function(err, connection) {
            connection.collection('todos', function(err, collection) {
                var cursor = collection.find(req.query);
//                 cursor.sort({ _id: -1 });
                cursor.sort({ created: -1 });
//                 cursor.skip(page_size * page).limit(page_size);
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
        getTodo(req, function(todo) {
//         var todo = req.body.todo;
            console.log(todo);
            if (! todo.hasOwnProperty('completed')) {
                todo.completed = false;
            }

            if (! todo.created) {
                todo.created = Date.create();
            } else {
                todo.created = Date.create(todo.created);
            }

            console.log(todo.created);

        //     todo.forEach(function(td) {
        //         if (td.id) {
        //             delete td.id;
        //             delete td.dependers;
        //             delete td.dependees;
        //             delete td.due;
        //         }
        //     });

            console.log('todo', todo);

            require('mongodb').connect(url, function(err, connection) {
                connection.collection('todos', function(err, collection) {
                    collection.save(todo, function(err, results) {
                        console.log(err, results);
                        res.send(200, { todo: results });
                        connection.close();
                    });
                });
            });
        });
    });

    var getTodo = function(req, callback) {
        var data = '';

        req.on('data', function(res) {
            data += res;
        });

        req.on('end', function() {
            callback(JSON.parse(data.toString()).todo);
        });
    };

    app.put('/todos/:id', function(req, res, next) {
// 
//             
//             var todo = req.body.todo;

        getTodo(req, function(todo) {
            require('mongodb').connect(url, function(err, connection) {
                console.log(err);
                connection.collection('todos', function(err, collection) {
                    console.log(todo);
                    todo._id = require('mongodb').ObjectID.createFromHexString(todo._id);
                    todo.created = new Date(todo.created);
                    collection.update({ _id: todo._id }, todo, function(err, result) {
                        console.log(err);
                        collection.save(todo, function(err, result) {
                            console.log('ok', err, result);
                            console.log(todo);
                            console.log({ todo: todo });
                            res.send(200, { todo: todo });
                            connection.close();
                        });
                    });
                });
            });
        });
    });

//     app.put('/todos/:id', function(req, res, next) {
//         console.log('SSSSS');
//         var todo = req.body.todo;
//         console.log(todo);
// 
//         mongo.removeById('todos', todo._id, function(result) {
//             mongo.save('todos', todo, function(results) {
//                 console.log('res', results);
//                 res.send(200, { todo: results });
//             });
//         });
//     });

    app.del('/todos/:id', function(req, res, next) {
        var id = require('mongodb').ObjectID.createFromHexString(req.params.id);

        require('mongodb').connect(url, function(err, connection) {
            connection.collection('todos', function(err, collection) {
                collection.remove({ _id: id }, function(err, result) {
                    console.log(result);
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
                    console.log(item);
                });
                res.send(200);
            });
        });
    });
};
