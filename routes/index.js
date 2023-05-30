var express = require('express');
var router = express.Router();
var Group = require('../models/group');

// Get Homepage
router.get('/', ensureAuthenticated, async function(req, res) {
	try {
	  const GroupQuery = { _id: { $in: req.user.groups } };
	  const group = await Group.find(GroupQuery);
	  res.render('index', {
		group: group,
		friend: req.user.friend,
		css: ['dashboard.css', 'bootstrap.css', 'dashboardimage.css']
	  });
	} catch (error) {
	  console.error('Error retrieving groups:', error);
	  res.status(500).send('Internal server error');
	}
  });  

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		console.log('not correct')
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}
module.exports = router;