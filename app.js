var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var config = require('./config/constants');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var moment = require('moment');
//var mongoose = require('mongoose');
var helmet = require('helmet');

var app = express();

app.use(helmet());

app.use(require('./middleware/headers'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: config.SESSION_PASS,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true}
}));

app.use(express.static('./node_modules/jquery/dist'));
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
require('./middleware/passport')(passport);

// Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon')));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(config.secret));
app.use(express.static(path.join(__dirname, 'public')));
// Connect Flash
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Global Variables
app.use('*', function (req, res, next) {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.authdata = req.user || null;
  res.locals.page = req.url;
  next();
});


app.use(express.static('./node_modules/socket.io-client/dist'));
app.use(express.static('./public'));
//app.use(express.static('./node_modules/jquery/dist'))
app.use('/', require('./routes/dashboard'));
app.use('/users', require('./routes/users'));
app.use('/schools', require('./routes/schools'));
//app.use('/report', require('./routes/report'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // if (req.path.indexOf('api')) {
  //   res.json({
  //     success: false,
  //     message: 'There was an error on the request',
  //     error: err
  //   });
  // } else {
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;



// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var bodyParser = require('body-parser');
// var session = require('express-session');
// var expressValidator = require('express-validator');
// var flash = require('connect-flash');
// var config = require('./config/constants');
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
// var moment = require('moment');
// var helmet = require('helmet');

// var app = express();

// app.use(helmet());

// app.use(require('./middleware/headers'));

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

// app.use(session({
//   secret: config.SESSION_PASS,
//   resave: true,
//   saveUninitialized: true
// }));

// //Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());
// require('./middleware/passport')(passport);

// // Validator
// app.use(expressValidator({
//   errorFormatter: function (param, msg, value) {
//     var namespace = param.split('.'),
//       root = namespace.shift(),
//       formParam = root;

//     while (namespace.length) {
//       formParam += '[' + namespace.shift() + ']';
//     }

//     return {
//       param: formParam,
//       msg: msg,
//       value: value
//     };
//   }
// }));

// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon')));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// // Connect Flash
// app.use(flash());
// app.use(function (req, res, next) {
//   res.locals.messages = require('express-messages')(req, res);
//   next();
// });

// //Global Variables
// app.use('*', function (req, res, next) {
//   res.locals.user = req.user || null;
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   res.locals.authdata = req.user || null;
//   res.locals.page = req.url;
//   next();
// });


// //For web
// app.use('/', require('./routes/dashboard'));
// app.use('/users', require('./routes/users'));


// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // if (req.path.indexOf('api')) {
//   //   res.json({
//   //     success: false,
//   //     message: 'There was an error on the request',
//   //     error: err
//   //   });
//   // } else {
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
//   //}
// });

// module.exports = app;