var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


// User Schema
var BillSchema = mongoose.Schema({
    description :{
        type: String
    },

});

const User = mongoose.model('User', BillSchema);

const createUser = async (newUser) => {
  try {
    const user = new User(newUser);
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserByUsername = (username) => {
  return User.findOne({ email: username }).exec();
};

const getUserById = (id) => {
  return User.findById(id).exec();
};

const comparePassword = (candidatePassword, hash) => {
  return bcrypt.compare(candidatePassword, hash);
};

module.exports = {
  User,
  createUser,
  getUserByUsername,
  getUserById,
  comparePassword
};