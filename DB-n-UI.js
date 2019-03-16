// DB-n-UI.js

// Walter Johnson
// CS290 W19 Week 9 HW Assignment: Database interactions and UI

"use strict";

// one constant to rule them all
const DUG = {
    express: null,
    app: null,
    handlebars: null,
    session: null,
    bodyParser: null,
    info: null,
    mysql: null,
    pool: null,
    exercises: []
};

DUG.express = require('express');
DUG.mysql = require('mysql');

DUG.app = DUG.express();
DUG.handlebars = require('express-handlebars').create({defaultLayout: 'main'});
DUG.bodyParser = require('body-parser');
DUG.info = require("./info.js");
DUG.app.use(DUG.express.static('public'));

DUG.app.use(DUG.bodyParser.json());
DUG.app.use(DUG.bodyParser.urlencoded({extended: false}));

DUG.app.engine('handlebars', DUG.handlebars.engine);
DUG.app.set('view engine', 'handlebars');
DUG.app.set('port', DUG.info.port);

DUG.pool = DUG.mysql.createPool({
    connectionLimit: 10,
    host: DUG.info.host,
    user: DUG.info.user,
    password: DUG.info.password,
    database: DUG.info.database
});

DUG.app.get('/', function (req, res) {
    let lbs, context = {}, queryString = "SELECT * FROM workouts ORDER BY id DESC";
    DUG.pool.query(queryString, function (err, result) {
        if (err) {
            context.error = "Error: Could not connect to database.  Please try again later.";
            throw err;
        }
        context.exercises = result;
        lbs = context.exercises.lbs;
        context.exercises.lbs = lbs ? "lbs" : "kg";
        res.render('workouts', context);
    });
});

DUG.app.post('/', function (req, res) {
    var response = {};

    if (req.body.action === "add") {
        let queryString, id, exer = {}, lbs;
        queryString = "INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?, ?, ?, ?, ?)";
        exer = req.body.exercise;
        lbs = (exer.units === "lbs");
        DUG.pool.query(queryString, [exer.exerciseName, exer.reps, exer.weight, exer.date, lbs], function (err, result) {
            if (err) {
                response.success = false;
                response.error = "Error: Could not connect to database.  Please try again later.";
                res.status(500);
                throw err;
            } else if (result.insertId) {
                id = result.insertId;
                response.id = id;
                response.success = true;
                exer.id = id;
                res.status(200);
            } else {
                response.success = false;
                response.error = "Error: Exercise could not be added to database.";
                res.status(500);
            }
            response.type = "add";
            res.type("plain/text");
            res.send(response);
        });
    }

    if (req.body.action === "edit row") {
        let queryString, exer = {};
        queryString = "UPDATE workouts SET name = ?, reps = ?, weight = ?, date = ?, lbs = ? WHERE id = ?";
        exer = req.body.exercise;
        lbs = (exer.units === "lbs");
        DUG.pool.query(queryString, [exer.exerciseName, exer.reps, exer.weight, exer.date, lbs, exer.id], function (err, result) {
            if (err) {
                response.success = false;
                response.error = "Error: Could not connect to database.  Please try again later.";
                res.status(500);
                throw err;
            } else if (!result.changedRows === 0) {
                response.id = exer.id;
                response.success = true;
                res.status(200);
            } else {
                response.success = false;
                response.error = "Error: Exercise could not be edited in database.";
                res.status(500);
            }
            response.type = "edit";
            res.type("plain/text");
            res.send(response);
        });
    }

    if (req.body.action === "delete") {
        let queryString = "DELETE FROM workouts WHERE id = ?";
        DUG.pool.query(queryString, [req.body.id], function (err, result) {
            if (err) {
                response.success = false;
                response.error = "Error: Could not connect to database.  Please try again later.";
                res.status(500);
                throw err;
            } else if (!result.affectedRows === 0) {
                response.id = req.body.id;
                response.success = true;
                res.status(200);
            } else {
                response.success = false;
                response.error = "Error: Exercise could not be deleted in database.";
                res.status(500);
            }
            response.type = "edit";
            res.type("plain/text");
            res.send(response);
        });
    }
});

DUG.app.get('/reset-table', function (req, res, next) {
    var context = {};
    DUG.pool.query("DROP TABLE IF EXISTS workouts", function (err) { //replace your connection pool with the your variable containing the connection pool
      var queryString = "CREATE TABLE workouts("+
      "id INT PRIMARY KEY AUTO_INCREMENT,"+
      "name VARCHAR(255) NOT NULL,"+
      "reps INT,"+
      "weight INT,"+
      "date DATE,"+
      "lbs BOOLEAN)";
      DUG.pool.query(queryString, function (err) {
        context.results = "Table reset";
        res.render('/', context);
      })
    });
  });

DUG.app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

DUG.app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

DUG.app.listen(DUG.app.get('port'), function () {
  console.log('Express started on http://localhost:' + DUG.app.get('port') + '; press Ctrl-C to terminate.');
});
