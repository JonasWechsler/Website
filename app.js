var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.home);
app.get('/index', routes.index);
app.get('/zbuff', routes.zbuff);
app.get('/flower', routes.flower);
app.get('/gravity', routes.gravity);
app.get('/bullseye', routes.seuss);
app.get("/quote", function (Req, res) {
    request('http://www.iheartquotes.com/api/v1/random?format=json&show_source=0&source=joel_on_software+paul_graham+prog_stylemyfortune', function (error, response, content) {
        if (!error && response.statusCode == 200) {
            console.log(content);
            res.send(content);
        } else {
            res.send("No quote found");
        }
    });
});
app.get('/rainbow', routes.rainbow);
app.get('/calculator', routes.calculator);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;