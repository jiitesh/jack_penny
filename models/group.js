var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
//var uniqueValidator = require('mongoose-unique-validator');
var partnership = mongoose.Schema({

});
var Bill = mongoose.Schema();
// Group Schema
var GroupSchema = mongoose.Schema({
        name:{
            type: String,
           // unique: true
        },
        description :{
            type: String
        },
        owner :{
            type: mongoose.Schema.Types.ObjectId , 
            ref : 'User'
        },
        members :[mongoose.Schema.Types.ObjectId],
        bills:[{
            name : {
                type : String
            },
            paid_By:{
                type:mongoose.Schema.Types.ObjectId, 
                ref :'User'
            },
            amount :{
                type : Number,
                integer :true
            },
            note :{
                type: String
            },
            partners: [{
                id: {
                    type : String
                },
                amount: {
                    type: Number,
                    integer : true
                },
                status: {
                    type: String
                }
            }]
        }]

});


const Group = module.exports=mongoose.model('Group', GroupSchema);

module.exports.createGroup = async function (newGroup) {
  try {
    return await newGroup.save();
  } catch (error) {
    throw error;
  }
};

module.exports.getGroupById = async function (id) {
  try {
    return await Group.findById(id);
  } catch (error) {
    throw error;
  }
};

module.exports.getGroupByName = async function (groupName, ownerId) {
    try {
      return await Group.findOne({ name: groupName, owner: ownerId });
    } catch (error) {
      throw error;
    }
  };

  module.exports.settlePartnership = async function (req, paidBy, partnership) {
    try {
      const user = await User.getUserById(paidBy);
  
      if (!user) {
        console.log('ERROR: User not found');
        return;
      }
  
      if (user.email !== partnership.id) {
        for (let i = 0; i < user.friend.length; i++) {
          const friend = user.friend[i];
  
          if (friend.email === partnership.id) {
            const amount = parseInt(friend.amount - partnership.amount);
  
            if (amount > 0) {
              await User.findOneAndUpdate(
                { $and: [{ 'friend.email': friend.email.toString() }, { 'email': user.email.toString() }] },
                { $set: { 'friend.$.action': 'You owe your friend', 'friend.$.amount': amount } }
              );
  
              await User.findOneAndUpdate(
                { $and: [{ 'friend.email': user.email.toString() }, { 'email': friend.email.toString() }] },
                { $set: { 'friend.$.action': 'Your friend owes you', 'friend.$.amount': -amount } }
              );
            } else if (amount < 0) {
              await User.findOneAndUpdate(
                { $and: [{ 'friend.email': friend.email }, { 'email': user.email }] },
                { $set: { 'friend.$.action': 'Your friend owes you', 'friend.$.amount': amount } }
              );
  
              await User.findOneAndUpdate(
                { $and: [{ 'friend.email': user.email }, { 'email': friend.email }] },
                { $set: { 'friend.$.action': 'You owe your friend', 'friend.$.amount': -amount } }
              );
            } else {
              await User.findOneAndUpdate(
                { $and: [{'friend.email': friend.email }, { 'email': user.email }] },
                { $set: { 'friend.$.action': 'Life is good', 'friend.$.amount': 0 } }
              );
  
              await User.findOneAndUpdate(
                { $and: [{ 'friend.email': user.email }, { 'email': friend.email }] },
                { $set: { 'friend.$.action': 'Life is good', 'friend.$.amount': 0 } }
              );
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };