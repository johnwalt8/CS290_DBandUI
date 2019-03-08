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
    mysql: null
};

DUG.express = require('express');

DUG.app = DUG.express();
DUG.handlebars = require('express-handlebars').create({defaultLayout: 'main'});
DUG.session = require('express-session');
DUG.bodyParser = require('body-parser');
DUG.info = require("./info.js");

DUG.app.use(DUG.bodyParser.urlencoded({extended: false}));
DUG.app.use(DUG.session({
    secret: 'SuperDuperSecretPassword',
    resave: false,
    saveUninitialized: true
}));

DUG.app.engine('handlebars', DUG.handlebars.engine);
DUG.app.set('view engine', 'handlebars');
DUG.app.set('port', DUG.info.port);

DUG.app.get('/', function (req, res, next) {
    var context = {};
    //If there is no session, go to the main page.
    if (!req.session.name) {
        res.render('newSession', context);
        return;
    }
    context.name = req.session.name;
    context.toDoCount = req.session.toDo.length || 0;
    context.toDo = req.session.toDo || [];
    console.log(context.toDo);
    res.render('workouts', context);
});

DUG.app.post('/', function (req, res) {
    var context = {};

    if (req.body['New List']) {
        req.session.name = req.body.name;
        req.session.toDo = [];
        req.session.curId = 0;
    }

    //If there is no session, go to the main page.
    if (!req.session.name) {
        res.render('newSession', context);
        return;
    }

    if (req.body['Add Item']) {
        req.session.toDo.push({"name":req.body.name, "id":req.session.curId});
        req.session.curId += 1;
    }

    if (req.body['Done']) {
        req.session.toDo = req.session.toDo.filter(function (e) {
            return e.id !== parseInt(req.body.id);
        });
    }

    context.name = req.session.name;
    context.toDoCount = req.session.toDo.length;
    context.toDo = req.session.toDo;
    console.log(context.toDo);
    res.render('workouts', context);
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
