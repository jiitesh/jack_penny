var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
const { engine } = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var http = require('http');
var stripe = require('stripe')('sk_test_VPmjNTc2VtrJ86yhm2UvwoYi');
mongoose.connect('mongodb://127.0.0.1:27017/UserData');
var db = mongoose.connection;
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

// Init App
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);


var routes = require('./routes/index');
var users = require('./routes/users')(io);

const handlebars= exphbs.create({
  defaultLayout: 'layout',
  extname:'handlebars',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
})
// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars',handlebars.engine);
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

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

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;  
  res.locals.groupId = req.groupId || null;                        //to use user object globally from everywhere on website
  next();
});



app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 7500));

server.listen(app.get('port'), function(){
  console.log('Server started on port '+app.get('port'));
});
module.exports = app;