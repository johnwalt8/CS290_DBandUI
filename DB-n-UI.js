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
DUG.bodyParser = require('body-parser');
DUG.info = require("./info.js");
DUG.app.use(DUG.express.static('public'));

DUG.app.use(DUG.bodyParser.urlencoded({extended: false}));

DUG.app.engine('handlebars', DUG.handlebars.engine);
DUG.app.set('view engine', 'handlebars');
DUG.app.set('port', DUG.info.port);

DUG.app.get('/', function (req, res) {
    res.render('workouts');
});

DUG.app.post('/', function (req, res) {
    var context = {}, response = {};
    console.log('post');

    if (req.body['addEdit']) {
        console.log('addEdit');
    }

    //If there is no session, go to the main page.
    // if (!req.session.name) {
    //     res.render('newSession', context);
    //     return;
    // }

    if (req.body['editRow']) {
        console.log('editRow');
    }

    if (req.body['deleteRow']) {
        console.log('deleteRow');
    }

    console.log(req.body);

    // res.render('workouts', context);
    response = "success";
    // res.send(response);
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
