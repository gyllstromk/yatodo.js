var MongoDB = require('easymongo');

var mongo = new MongoDB({db: 'todos'});

module.exports = function(app) {
    app.get('/todos', function(req, res, next) {
        for (var key in req.query) {
            if (req.query[key] === 'true') {
                req.query[key] = true;
            } if (req.query[key] === 'false') {
                req.query[key] = false;
            }
        }
    //     {created: {'$lte': new Date(2012, 08, 27)}}

        var page = parseInt(req.query.page, 10) || 0;
        var page_size = parseInt(req.query.page_size, 10) || 10;

        delete req.query.page;
        delete req.query.page_size;

        mongo.find('todos', req.query, { sort: { created: -1 }, skip: page_size *
            page, limit: page_size }, function(results) {
                res.send({ todos: results });
            });
    });

    app.get('/todos/:id', function(req, res, next) {
        mongo.find('todos', { _id: req.params.id }, function(results) {
            res.json({todos: results.map(function(entry) {
                return entry;
            })});
        });
    });

    app.post('/todos', function(req, res, next) {
        console.log('post', req.body);
        var todo = req.body.todo;
        console.log(todo);
        if (! todo.hasOwnProperty('completed')) {
            todo.completed = false;
        }

        if (! todo.created) {
            todo.created = new Date();
        }

    //     todo.forEach(function(td) {
    //         if (td.id) {
    //             delete td.id;
    //             delete td.dependers;
    //             delete td.dependees;
    //             delete td.due;
    //         }
    //     });

        console.log('todo', todo);

        mongo.save('todos', todo, function(results) {
            results.id = results._id;
            console.log('guh', results);
            res.send(200, { todo: results });
        });
    });

    app.put('/todos/:id', function(req, res, next) {
        console.log(req.body);
        mongo.removeById('todos', req.body.todo, function(result) {
            mongo.save('todos', req.body.todo, function(result) {
                console.log('put', result);
                res.send(200, { todo: result });
            });
        });
    });

    app.put('/todos', function(req, res, next) {
        var todo = req.body.todo;
        console.log(todo);

        mongo.removeById('todos', todo._id, function(result) {
            mongo.save('todos', todo, function(results) {
                console.log('res', results);
                res.send(200, { todo: results });
            });
        });
    });

    app.del('/todos/:id', function(req, res, next) {
        mongo.removeById('todos', req.params.id, function(result) {
            console.log(result);
            res.send(200, { todo: result });
        });
    });
};
