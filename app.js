var express = require('express');
var path = require('path');
var morgan = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var mongo = require('mongodb');
var mongoose = require('mongoose');

var db = mongoose.connection;

//require routing paths
var routes = require('./routes/index');
var users = require('./routes/users');
// var profile = require('./routes/profile');

var app = express();

app.set('port', process.env.PORT || 3000);

// view engine setup - jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// make db accessible to routes
app.use(function(req,res,next){
    req.db = db;
    next();
});

//logging
app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// handle express sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.');
      var root    = namespace.shift();
      var formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(cookieParser());

// serve static content 
app.use(express.static(__dirname + '/static'));

//flash messages on action
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//have user available
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  // console.log(res.locals.user);
  next();
});

app.use('/', routes);
app.use('/users', users);


// 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development - w stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production - no stacktrace
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
