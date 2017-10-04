require('dotenv').config();
//this reads .env file and sticks that setting into our environment
var express = require('express');
var multer = require('multer');
//allows us to make a multipart form
var upload = multer({dest: './uploads/'});
var cloudinary = require('cloudinary');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

var session = require('express-session');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);


/*
 * setup the session with the following:
 *
 * secret: A string used to "sign" the session ID cookie, which makes it unique
 * from application to application. Hidden in the .env.
 *
 * resave: Save the session even if it wasn't modified. We'll set this to false
 *
 * saveUninitialized: If a session is new, but hasn't been changed, save it.
 * We'll set this to true.
 */
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

//flash is middleware that is called my req.flash()
app.use(flash());

//this 3 lines must appear AFTER your session is configured, it has to know your session exists
var passport = require('./config/ppConfig');
app.use(passport.initialize());
app.use(passport.session());

//use flash
app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

///////// routes /////////////////

app.get('/', function(req, res) {
  res.render('index');
});


app.use('/auth', require('./controllers/auth'));
app.use('/spaces', require('./controllers/spaces'));



var server = app.listen(process.env.PORT || 3000);

module.exports = server;
