var express = require('express');
var passport = require('passport');
var path = require('path');
var fs = require('fs');
var mongoStore = require('connect-mongo')(express);
var config = require('./server/config/config');
var cors = require('cors');
var app = express();
var io = require('socket.io').listen(app.listen(3000));


global.appRoot = path.resolve(__dirname);


// create our app w/ express
//Connect to db
var db = require('./server/db/mongo').db;
app.use(cors());
//Bootstrap all models
var modelsPath = path.join(__dirname, 'server/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    require(modelsPath + '/' + file);
})

var pass = require('./server/config/pass');

// App Configuration
app.configure('development', function () {
    app.use(express.static(path.join(__dirname, '.tmp')));
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.errorHandler());
    // app.set('views', __dirname + '/app/views');
});

app.configure('production', function () {
    app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(express.static(path.join(__dirname, 'public')));
    // app.set('views', __dirname + '/views');
});

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
app.use(express.logger('dev'));

// cookieParser should be above session
app.use(express.cookieParser());
// bodyParser should be above methodOverride
// app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// express/mongo session storage
app.use(express.session({
    secret: 'umair',
    store: new mongoStore({
        url: config.db,
        collection: 'sessions'
    })
}));

// use passport session
app.use(passport.initialize());
app.use(passport.session());

//routes should be at the last
app.use(app.router);



//Bootstrap routes
require('./server/config/routes')(app,io);


// listen (start app with node server.js) ======================================
// app.listen(3000);
console.log("App listening on port 3000");


// var mongoose = require('mongoose');                     // mongoose for mongodb
// var morgan = require('morgan');             // log requests to the console (express4)
// var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
// var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
// var database = require('./config/database');
// var passport = require('passport');
// var flash    = require('connect-flash');
// var session      = require('express-session');
// mongoose.connect(database.url);


// app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
// app.use(morgan('dev'));                                         // log every request to the console
// app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
// app.use(bodyParser.json());                                     // parse application/json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
// app.use(methodOverride());
//
// app.set('view engine', 'ejs'); // set up ejs for templating
//
// app.use(session({ secret: 'umairisthebest' })); // session secret
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
// app.use(flash()); // use connect-flash for flash messages stored in session
//
//
// require('./config/passport')(passport); // pass passport for configuration
// require('./app/routes.js')(app,passport); // load our routes and pass in our app and fully configured passport
// require('./app/socket')(io);
