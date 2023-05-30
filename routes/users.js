
module.exports = function(io){
    var express = require('express');
    var router = express.Router();
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var User = require('../models/user');
    var Group = require('../models/group');
    var bcrypt = require('bcryptjs');
    connections = [];
    // Register
    router.get('/register', function(req, res){
        res.render('register',{
            css: ['style.css', 'bootstrap.css','image.css']
        });
    });

    router.get('/managerlogin', function(req, res){
        res.render('managerlogin',{
            css: ['style.css', 'bootstrap.css','image.css']
        });
    });

    router.get('/manager', function(req, res){
        res.render('manager',{
            css: ['style.css', 'bootstrap.css','image.css']
        });
    });

    router.post('/loginmanager',function (req,res) {
        var username = req.body.username;
        var password = req.body.password;

        console.log(username + ' ' + password);

        if(username == 'manager' && password == 'manager'){
            console.log(username + '' + password);
            res.redirect('/users/manager');

        }
        else{
            req.flash('error_msg', 'You have entered incorrect details');
            res.redirect('/users/managerlogin');
        }

    });

    router.get('/manager/report', function(req, res){
        res.render('report',{
            css: ['style.css', 'bootstrap.css','image.css']
        });
    });

    // Login
    router.get('/login', function(req, res){
        res.render('login',{
            css: ['style.css', 'bootstrap.css','image.css']
        });
    });
    
    
    router.post('/register', function(req, res){
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var phone_no = req.body.phone_no;
        var email = req.body.email;
        var password = req.body.password;
        var confirm_password = req.body.confirm_password;

        // Validation
        req.checkBody('confirm_password', 'Passwords do not match').equals(req.body.password);
        req.checkBody('first_name','first name should contain only alphabets ').isAlpha();
        req.checkBody('last_name','last name should contain only alphabets ').isAlpha();
        req.checkBody('phone_no','phone no must be numericals').notEmpty().isInt();

        var errors = req.validationErrors();
    
        if(errors){
            res.render('register',{
                errors:errors,
                css: ['style.css', 'bootstrap.css','image.css']            
            });
        } 
        else {
            var newUser = new User({
                first_name : req.body.first_name,
                last_name : req.body.last_name,
                phone_no : req.body.phone_no,
                email : req.body.email,
                password : req.body.password
            });
            console.log(newUser);
            console.log('new user has been stored');
            User.create(newUser)
            .then(user => {
              console.log(user);
              req.flash('success_msg', 'You are registered and can now login');
              res.redirect('/');
            })
            .catch(err => {
              console.log('ERROR', err);
              res.render('register', { errors: err });
            });          
        }
    });
    
  router.post('/addgroup', function(req, res){
        var group_name = req.body.group_name;
        var group_description = req.body.group_description;
       
        var newgroup = new Group({
            name: req.body.group_name,
            description: req.body.group_description,
            owner : req.user.id,
            members :[req.user.id]
        });
        console.log(newgroup);
        console.log('this is new group');

        Group.createGroup(newgroup)
            .then((group) => {
                console.log(group);
                console.log('the code has entered into the function');
                return User.findOneAndUpdate(
                { _id: req.user._id },
                { $addToSet: { groups: group._id } }
                );
            })
            .then((model) => {
                console.log(model);
                console.log('Successfully created a new group');
                req.flash('success_msg', 'You have successfully created a new group');
                res.redirect('/');
            })
            .catch((err) => {
                console.error(err);
                req.flash('error_msg', 'Please make sure that the group name does not already exist.');
                res.redirect('/');
            });
});

    passport.use(new LocalStrategy(
        async (username, password, done) => {
          try {
            const users = await User.find({ email: username }).limit(1);
      
            if (users.length === 0) {
              return done(null, false, { message: 'Unknown User' });
            }
      
            const isMatch = await bcrypt.compare(password, users[0].password);
      
            if (isMatch) {
              console.log('Password match!!');
              return done(null, users[0]);
            } else {
              return done(null, false, { message: 'Invalid password' });
            }
          } catch (error) {
            console.error('Error authenticating user:', error);
            return done(error);
          }
        }
      ));
    
      passport.serializeUser((user, done) => {
        done(null, user.id);
      });      

      passport.deserializeUser((id, done) => {
        User.find({ _id: id }).limit(1)
          .then((users) => {
            done(null, users[0]);
          })
          .catch((error) => {
            console.error('Error deserializing user:', error);
            done(error);
          });
      });      
      

    router.post('/login', passport.authenticate('local', { failureFlash: true }),(req, res) => {
        req.flash('success_msg', 'You are now logged in');
        console.log('hello 89')
        if (req.session.returnTo) {
          res.redirect(req.session.returnTo);
          delete req.session.returnTo;
        } else {
          res.redirect('/');
        }
      });
       

      router.get('/logout', function(req, res){
        req.logout(function(err) {
            if (err) {
                console.log(err);
                req.flash('error_msg', 'Something went wrong. Try again.');
                res.redirect('/');
            } else {
                req.flash('success_msg', 'You have successfully logged out');
                res.redirect('/users/login');
            }
        });
    });
    

    
    router.post('/addMember/:id', ensureAuthenticated, async function(req, res) {
      const groupId = req.params.id;
      const member_email = req.body.member_email;
      
      console.log('groupId:', groupId);
      console.log('member_email:', member_email);
      
      try {
        const mygroup = await Group.getGroupById(groupId);
        if (!mygroup) {
          console.log('ERROR: Group not found');
          req.flash('error_msg', 'No such group');
          return res.redirect('/users/group/' + groupId);
        }
        
        console.log('mygroup:', mygroup);
        
        const user = await User.findOne({ email: member_email });
        if (!user) {
          console.log('ERROR: User not found');
          req.flash('error_msg', 'No such user');
          return res.redirect('/users/group/' + groupId);
        }
        
        console.log('user:', user);
        
        await User.findOneAndUpdate(
          { email: member_email },
          { $addToSet: { groups: mygroup._id } }
        );
        
        await Group.findOneAndUpdate(
          { _id: mygroup._id },
          { $addToSet: { members: user._id } }
        );
        
        console.log('Member added to group');
        req.flash('success_msg', 'Member added to group');
        return res.redirect('/users/group/' + groupId);
      } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Something went wrong. Try again');
        return res.redirect('/users/group/' + groupId);
      }
    });
    
    

    function ensureAuthenticated(req, res, next){
        if(req.isAuthenticated()){
            return next();
        } else {
            //req.flash('error_msg','You are not logged in');
            res.redirect('/users/login');
        }
    }


    router.post('/addFriend', function(req, res) {
      var friendEmail = req.body.friend_email;
      var alreadyFriend = false;

      console.log(req.user); // Check if req.user is defined and has the expected properties
      console.log('User ID:', req.user._id);
      console.log('Friend Email:', friendEmail);
      console.log('Friend:', req.user.friend);
    
      if (req.user.friend.length === 0) {
        console.log('No friends found');
        alreadyFriend = false;
        // Handle the case when no friends are present
      } else {
        console.log('Searching current friend list');
        for (var i = 0; i < req.user.friend.length; i++) {
          if (req.user.friend[i].email === friendEmail) {
            alreadyFriend = true;
            break;
          }
        }
        // Rest of your code...
      }
    
      console.log('hello my dear friend');
      if (alreadyFriend) {
        console.log('User already in contacts');
        req.flash('error_msg', 'User already in contacts.');
        return res.redirect('/');
      }
    
      console.log('Adding user to contacts');
    
      User.getUserByUsername(friendEmail)
        .then(function(myUser) {
          console.log('Getting user by username');
    
          if (myUser === null) {
            console.log('ERROR: User not found');
            req.flash('error_msg', 'No such user');
            return res.redirect('/');
          }
    
          console.log('MyUser:', myUser);
          console.log('Hello there');
    
          var newFriend = {
            name: myUser.first_name + ' ' + myUser.last_name,
            email: myUser.email,
            action: 'life is good',
            amount: 0
          };
    
          User.findOneAndUpdate(
            { email: friendEmail },
            { $push: { friend: newFriend } },
            {new : true}
          )
        .then(function() {

          return User.findOneAndUpdate(
            { _id: req.user._id },
            { $push: { friend: newFriend } },
            {new : true}
          );
        })
        .then(function() {
          req.flash('success_msg', 'User added to contacts');
          res.redirect('/');
        })
        .catch(function(err) {
          console.log('Error:', err);
          req.flash('error_msg', 'Something went wrong. Please try again.');
          return res.redirect('/');
        });
    })
    .catch(function(err) {
      console.log('Error:', err);
      req.flash('error_msg', 'Something went wrong. Please try again.');
      return res.redirect('/');
    });
});

    router.get('/group/:id', ensureAuthenticated, async function(req, res) {
      try {
        console.log('Trying to access group');
        const groupId = req.params.id;
        console.log(groupId);

        const group = await Group.getGroupById(groupId);
        if (!group) {
          console.log('ERROR: Group not found');
          req.flash('error_msg', 'No such group');
          return res.redirect('/');
        }
    
        console.log(group);
        const memberQuery = { _id: { $in: group.members } };
        console.log('Group members:', group.members);
        const members = await User.find(memberQuery).exec();

        console.log('here is the group');
        console.log(members);
        console.log('Group Bills:',group.bills);
    
        let option = null;
        if (group.owner.equals(req.user._id)) {
          option = groupId;
        } else {
          console.log(`owner ${group.owner} user ${req.user._id}`);
        }
    
        if (req.user.friend && req.user.friend.length > 0) {
          console.log(req.user.friend[0].name);
        } else {
          console.log('No friend found');
        }        

        res.render('group', {
          friend: req.user.friend,
          member: members,
          bill: group.bills,
          groupId: groupId,
          settleOption: option,
          css: ['dashboard.css', 'bootstrap.css', 'dashboardimage2.css']
        });
      } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Something went wrong. Please try again.');
        return res.redirect('/');
      }
    });


    router.post('/group/settle/:id', ensureAuthenticated, async function (req, res) {
      try {
        console.log('we shall settle the bill');
        const group_id = req.params.id;
        const group = await Group.getGroupById(group_id);
    
        if (!group) {
          console.log('ERROR: Group not found');
          req.flash('error_msg', 'No such group');
          res.redirect('/');
          return;
        }
    
        let finish = 0;
        for (let i = 0; i < group.bills.length; i++) {
          const currBill = group.bills[i].toJSON();
          finish += parseInt(currBill);
          console.log("length: " + currBill.partners.length);
    
          for (let j = 0; j < currBill.partners.length; j++) {
            console.log("bill " + i + " partnership " + j + " status " + currBill.partners[j].status);
            console.log("user id " + currBill.paid_By + " partnership " + currBill.partners[j]);
    
            try {
              await new Promise((resolve, reject) => {
                Group.settlePartnership(req, currBill.paid_By, currBill.partners[j], function (err, usr) {
                  if (err) {
                    reject(err);
                  } else {
                    finish -= 1;
                    resolve();
                  }
                });
              });
            } catch (error) {
              console.log(error);
              req.flash('error_msg', 'Error occurred while settling partnerships.');
              res.redirect('/');
              return;
            }
          }
        }
    
        while (finish) {}
    
        req.flash('success_msg', 'Transactions will be updated soon.');
        res.redirect('/');
      } catch (error) {
        console.log(error);
        req.flash('error_msg', 'Something went wrong. Try again.');
        res.redirect('/');
      }
    });
    

    router.post('/group/addBill/:id', ensureAuthenticated, async function (req, res) {
      try {
        const group_id = req.params.id;
        const part = req.body.myInputs;
        const amounts = req.body.myInputs1;
        const amount = req.body.amount;
        const note = req.body.note;
        console.log(group_id);
        console.log(part);
        console.log(amounts);
        console.log(amount);
        console.log(note);
        var sum = parseInt(amounts[0]);
        for (let m = 1; m < part.length; m++) {
          sum += parseInt(amounts[m]);
        }
        console.log("sum: " + sum);
    
        if (sum == amount) {
          const newBill = {
            name: req.user.first_name + " " + req.user.last_name,
            paid_By: req.user._id,
            amount: amount,
            note: note,
            partners: []
          };
    
          for (let m = 0; m < part.length; m++) {
            newBill.partners.push({
              id: part[m],
              amount: parseInt(amounts[m]),
              status: "Unpaid"
            });
          }
    
          const group = await Group.findOneAndUpdate(
            { _id: group_id },
            { $addToSet: { bills: newBill } },
            { new: true }
          );
    
          if (!group) {
            console.log('ERROR: Group not found');
            req.flash('error_msg', 'No such group');
            res.redirect('/users/group/' + group_id);
            return;
          }
    
          console.log('Bill added');
          req.flash('success_msg', 'Bill added');
          res.redirect('/users/group/' + group_id);
        } else {
          req.flash('error_msg', 'Sum doesn\'t match');
          res.redirect('/users/group/' + group_id);
        }
      } catch (error) {
        console.log(error);
        req.flash('error_msg', 'Something went wrong. Try again.');
        res.redirect('/users/group/' + group_id);
      }
    });
    

router.post('/charge',function(req,res){
      var friend_email = req.body.friend_email;
    var SenderEmail = req.user.email;
            console.log(SenderEmail);
            console.log(friend_email);
 User.update(
      { $and:[{"friend.email": friend_email },{"email": SenderEmail}]},
      { "$set": { "friend.$.action": "You owe you friend" },
      "$set":{"friend.$.amount" : "0"} },function(err){
      console.log(SenderEmail);
      console.log(friend_email);
      });

      stripe.customers.create({
      email : req.body.email,
      source : req.body.stripeToken
       })
       .then(customer => stripe.charges.create({
           amount : req.body.amount * 100,
           description : 'Friend debt' ,
           currency : 'usd' ,
           customer : customer.id
       }))
       .then(charge => {
        req.flash('success_msg', 'Payment Done Successfully');
        res.redirect('/')
    });
    });


    io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log('Connected : %s sockets connected',connections.length);

    //Disconnect
    socket.on('disconnect',function(data){
        connections.splice(connections.indexOf(socket),1);
        console.log('disconnected : %s sockets connected',connections.length);
    });
    
   socket.on('send message',function(data){
       
        io.emit('new message',{
            msg : data
        });
     });

    });
    return router;
};