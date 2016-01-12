var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


//PROFILE

//logged in profile
router.get('/', ensureAuthenticated, function(req, res, next) {
    res.render('profile/profile', {
		'title': 'Profile'
	});
});



//only let logged in users go to route
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
      return next(); 
    }
  res.redirect('/users/login');
}

module.exports = router;

