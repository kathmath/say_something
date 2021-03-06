var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var mongodbUri = 'mongodb://heroku_1bbmxgrn:lk7vcdtm8fg9rhbr9hjl7vu0it@ds047095.mongolab.com:47095/heroku_1bbmxgrn';

// mongoose.connect(process.env.MONGOLAB_URI || mongodbUri || 'mongodb://localhost/saysomething');
mongoose.connect('mongodb://localhost/saysomething');

//mongoose user schema
var UserSchema = mongoose.Schema({
	username:{
		type: String,
		index: true
	},
	password:{
		type: String,
		required: true,
		bcrypt: true
	},
	email:{
		type: String
	},
	name:{
		type: String
	},
	comments: []
});


//mongoose model
var User = mongoose.model('User', UserSchema);
module.exports = User;


module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if(err) return callback(err);
		callback(null, isMatch);
	});
}

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.createUser = function(newUser, callback){
		bcrypt.hash(newUser.password, 10, function(err, hash) {
			if(err) throw err;
			// set hashed password
			newUser.password = hash;
			//create User
			newUser.save(callback);
		});	
}

module.exports.addComment = function(comment, username, callback) {
	var query = {username: username};
	User.findOneAndUpdate(
		query,
		{$push: {'comments': comment}},
		{safe: true, upsert: true},
		callback
	);
}



