var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');

var FriendSchema = mongoose.Schema({
	name : {
		type : String
	},
	email: {
		type : String
	},
	action:{
		type : String
	},
	amount : {
		type: Number,
		integer : true
	}
});

// User Schema
var UserSchema = mongoose.Schema({
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	phone_no: {
		type: String
	},
	email: {
		type: String,
        unique: true
	},
	password: {
		type: String
	},
	notification :[{

		to_user: {      //Email of reciever
			type:String
		},
		from_user:{    //Email of sender
			type:String
		},
		message:{
			type:String
		},
		bill_id:{
			type: mongoose.Schema.Types.ObjectId
		}
	}],
	groups: [mongoose.Schema.Types.ObjectId],
	friend:[FriendSchema]
});

UserSchema.plugin(uniqueValidator);
UserSchema.pre('save', async function (next) {
  const user = this;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

module.exports.getUserByUsername = function(username){
return User.findOne({ email: username }).exec();
}

module.exports.getUserById = function(id) {
	return User.findById(id).exec();
}  

module.exports.comparePassword = async function(candidatePassword, hash) {
	try {
		const isMatch = await bcrypt.compare(candidatePassword, hash);
		return isMatch;
	} catch (err) {
		throw err;
	}
}

