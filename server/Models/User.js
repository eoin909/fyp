var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		index:true
	},
	password: {
		type: String
	},
	highscore: {
		type: Number,
		required: true
		}
});

var User = module.exports = mongoose.model('UserData', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.updateHighScore = function(user){
	  User.getUserByUsername(user.username, function (err, post) {
		if (err) return next(err);
		user.highscore = (post.highscore + user.highscore);
		console.log("user.highscore " + user.highscore);
		User.findOneAndUpdate(
													{ username: user.username},
			 										{ $set: {highscore: user.highscore} },
			  									function(resp){console.log("done");	}
												);
	});

// module.exports.entireCollection = function () {
// 	let array = [];
// 	const cursor = User.find({});
// 	while(await cursor.hasNext()) {
//   	const doc = await cursor.next();
// 		array.push(doc);
//   	// process doc here
// }
//
// return array;
// }

// myCollection.find({}, function(err, resultCursor) {
//   function processItem(err, item) {
//     if(item === null) {
//       return; // All done!
//     }
//
//     externalAsyncFunction(item, function(err) {
//       resultCursor.nextObject(processItem);
//     });
//
//   }
//
//   resultCursor.nextObject(processItem);
// }
//
 }
