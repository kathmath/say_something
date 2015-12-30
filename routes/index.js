var express = require('express');
var router = express.Router();

//Get homepage
router.get('/', function(req, res, next) {
	res.render('index', { 
		title: 'Index' 
	});
});


// function ensureAuthentication(req, res, next) {
// 	//authenticate with Passport
// 	if(req.isAuthenticated()) {
// 		return next();
// 	}
// 	res.redirect('/users/login');
// }

module.exports = router;
