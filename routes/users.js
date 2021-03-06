var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var multer  = require('multer');
var upload = multer();

var User = require('../models/user');



//REGISTER
//GET registration page
router.get('/register', function(req, res, next) {
	res.render('register', {
		'title': 'Register'
	});
});

//POST registration form values to database
router.post('/register', upload.array(), function(req, res, next) {
	//get form values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var comment = req.body.comment;
	var password = req.body.password;
	var password2 = req.body.password2;

	//form validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Invalid Email').isEmail();
	req.checkBody('username', 'username is required').notEmpty();
	req.checkBody('password', 'password is required').notEmpty();
	req.checkBody('password2', 'passwords do not match').equals(req.body.password);

	//check for errors
	var errors = req.validationErrors();

	if(errors){
		res.render('register', {
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			comments: comment
		});

		//create user in db
		User.createUser(newUser, function(err,user){
			if(err) throw err;
			console.log(user);
		});

		//success message
		req.flash('success', 'You are now registered!');

		// res.location('/');
		res.redirect('./login');
	}

});

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.getUserById(id, function(err, user){
		done(err, user)
	});
});



//LOGIN
//go to login page
router.get('/login', function(req, res, next) {
	console.log('welcome, please log in!');
	res.render('login', {
		'title': 'Login'
	});
});

//Check if password is correct with Passport
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user) {
				console.log('Unknown User');
				return done(null, false, {message: 'Unknown User'});
			}

			User.comparePassword(password, user.password, function(err, isMatch) {
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else {
					console.log('Invalid password');
					return done(null, false, {message: 'Invalid Password'});
				}
			});
		});
	}
));

//Go to user profile page if login succeeds, back to login if not
router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}), function(req, res) {
	console.log('Authentication Successful!');
	req.flash('success', 'You are now logged in!');
	res.redirect('./profile');
});



//PROFILE
//logged in profile
router.get('/profile', ensureAuthenticated, function(req, res, next) {
    res.render('profile', {
		'title': 'Profile'
	});
});



//PUBLIC PROFILE

//get public profile
router.get('/publicprofile/:username', function(req, res, next) {
	var username = req.params.username;
	//get user info from db
	User.getUserByUsername(username, function(err, user) {
		if(err) {
			console.log(err);
			res.send(err);
		} 
		if(user === null) {
			console.log('Unknown User');
			return done(null, false, {message: 'Unknown User'});
			}
		else {
			res.render('publicprofile', {
				'user': user,
				'username': user.username
			});
		}
	});
});


//POST comment form values to database
router.post('/publicprofile/:username', function(req, res, next) {
	var username = req.params.username;
	console.log(username);
	var comment = req.body.comment;

	User.addComment(comment, username, function(err, user) {
		if(err) throw err;
		console.log(user);
	});

	req.flash('success', 'Comment Added!');
	res.redirect(username);
});

module.exports.addComment = function(comment, username, callback) {
	// var newComment = comment;
	// var query = {'username': username};

	User.findOneAndUpdate(
		{'username': username},
		{$push: {'comments': comment}},
		{safe: true, upsert: true},
		callback
	);
}


//LOGOUT
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'You have logged out');
	console.log('logged out')
	res.redirect('/users/login');
})

//only let logged in users go to route
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
      return next(); 
    }
  res.redirect('/users/login');
}

module.exports = router;

