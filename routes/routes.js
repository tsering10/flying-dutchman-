var request = require('request');
var Q = require("q");
var debug = require('debug')('fd2');

// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs', { error: '' }); // load the index.ejs file
	});


     // =====================================
	 // place the order ========
	 // =====================================
 
     app.get('/beer/:beer_id', function(req, res) {

        //http://pub.jamaica-inn.net/fpdb/api.php?username=ervtod&password=ervtod&action=inventory_get'
        var beer_id = req.param('beer_id');
        console.log(" Request for beer " + beer_id);
        var url = 'http://pub.jamaica-inn.net/fpdb/api.php?username=' +
        req.user.username.trim() + '&password=' + req.user.password.trim() +
        '&action=beer_data_get&beer_id='+beer_id;
        
        
        request(url, function(err, resp, body) {
            body = JSON.parse(body);

            //TODO show the correct message to the user
            if (body.type == 'error') {
                console.log("failed to get information for beer " + beer_id);
                resp.json(500, {
                    error: "API : Failed to get information for beer " + beer_id
                }); // create the loginMessage and save it to session as flashdata
            } else {
                var beers = body.payload;
                res.json(beers);
            }

        });
        
        
    });



    // =====================================
	// orders PAGE (with login links) ========
	// =====================================
	app.get('/order', function(req, res) {
		res.render('order.ejs'); // load the index.ejs file
	});

     // =====================================
	// orders PAGE (with login links) ========
	// =====================================
	app.get('/account', function(req, res) {
		res.render('account.ejs'); // load the index.ejs file
	});
     // =====================================
	 // place the order ========
	 // =====================================
 
     app.post('/placeorder', function(req, res) {

        //http://pub.jamaica-inn.net/fpdb/api.php?username=ervtod&password=ervtod&action=inventory_get'
        
       //items: [{id: "157503", quantity: "2"}]
       //0: {id: "157503", quantity: "2"}
       //id: "157503"
       //quantity: "2"
       //order: "41.20"

        var url = 'http://pub.jamaica-inn.net/fpdb/api.php?username=' + req.user.username.trim() + '&password=' + req.user.password.trim() +'&action=inventory_get';
        //if(username=="aji") {

        request(url, function(err, resp, body) {
            body = JSON.parse(body);

            //TODO show the correct message to the user
            if (body.type == 'error') {
                console.log("failed to get beers");
                resp.json(500, {
                    error: "Incorrect username or password."
                }); // create the loginMessage and save it to session as flashdata
            } else {
                var beers = body.payload;
                console.log("beers one id" + body.payload[0].beer_id)

                res.json(beers);
            }

        });
        
        
    });


    // =====================================
	// get beer ========
	// =====================================
      app.get('/beers', function(req, res) {

        //http://pub.jamaica-inn.net/fpdb/api.php?username=ervtod&password=ervtod&action=inventory_get'

        var url = 'http://pub.jamaica-inn.net/fpdb/api.php?username=' + req.user.username.trim() + '&password=' + req.user.password.trim() +'&action=inventory_get';
        //if(username=="aji") {

        request(url, function(err, resp, body) {
            body = JSON.parse(body);

            //TODO show the correct message to the user
            if (body.type == 'error') {
                console.log("failed to get beers");
                resp.json(500, {
                    error: "Incorrect username or password."
                }); // create the loginMessage and save it to session as flashdata
            } else {
                var beers = body.payload;
                console.log("beers one id" + body.payload[0].beer_id)

                res.json(beers);
            }

        });
    });

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { error: '' });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/order', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : 'Incorrect username or password' // allow flash messages
	}));


	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}