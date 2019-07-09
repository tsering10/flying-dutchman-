// server.js

// set up ======================================================================
// get all the tools we need

var port     = process.env.PORT || 8080;
var express = require('express');
var path = require('path');
var request = require('request');
var favicon = require('serve-favicon');
var flash = require('connect-flash');
var cache = require('memory-cache');
var debug = require('debug')('fd2');

// Expres 4 new dependencies
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// Engine for templating
var engine = require('ejs-locals');

// User defined routes
// Passport modules to login w/ different services
var passport = require('passport')
,LocalStrategy = require('passport-local').Strategy
, app = express();


// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// configuration ===============================================================
passport.serializeUser(function(user, done) {
    done(null, user.user_id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    //TODO store the user in the cache , and on logout remove from the cache
    //User.findById(id, function(err, user) {

    var user = cache.get(id);
    done(null, cache.get(id));

});


// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

      
        // if the user is found but the password is wrong
        //if (!user.validPassword(password))
        //return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        //return done(null, user);
        // });

        var url = 'http://pub.jamaica-inn.net/fpdb/api.php?username=' + username.trim() + '&password=' + password.trim() +'&action=iou_get';
        //if(username=="aji") {

            request(url, function(err, resp, body) {
                body = JSON.parse(body);

                  //TODO show the correct message to the user
                if (body.type == 'error') {
                    console.log("Authentication failure");
                    return done(null, false, {
                        error: "Incorrect username or password."
                    }); // create the loginMessage and save it to session as flashdata
                } else {
                    var user_auth = body.payload[0];
                    //Add the user name and password 
                    user_auth.username = username;
                    user_auth.password = password;
                    
                    //Add the role part 
                    
                    //console.log("Returned user " + body.payload[0].first_name)
                    cache.put(user_auth.user_id , user_auth);
                    return done(null, user_auth);
                    
                    
                    
                    
                }

            });



    }));


// set up our express application
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

	
app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/public/'));

// required for passport
app.use(session({
    secret: 'fd'
    }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//check authentication
app.use(function (request, response, next) {
    var permittedUrls = ['/login', '/'];
    if (!~permittedUrls.indexOf(request.url) && !request.user) { // change to !(x+x)??
        response.redirect('/login');
    } else {
        response.locals.user = request.user;
        next();
    }
});

// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport



// launch ======================================================================
app.listen(port);
debug('The magic happens on port ' + port);