var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var constants = require('../config/constants');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var countries = require('country-list');
//var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
//var bodyParser = require('body-parser');



router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {

  console.log('testing route');
  res.render('users/register', {
    countries: countries.getNames()
  });
});

router.post('/users/login', 
passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true,
  failureFlash: 'Invalid username or password.'}));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(function (username, password, done) {
  User.getUserByUsername(username, function (err, user) {
    if (err) throw err;
    if (!user) {
      return done(null, false, {
        message: 'Unknown user'
      });
    }

    User.comparePassword(password, user.password, function (err, isMatch) {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'User does not match password'});
      }
    });
  });
}));

router.post('/register', (req, res) => {

  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var phoneNumber = req.body.phoneNumber;
  var district = req.body.district;
  var ward = req.body.ward;
  var country = req.body.country;
  var region = req.body.region;
  var street = req.body.street;
  var firstName = req.body.first_name;
  var middleName = req.body.middle_name;
  var lastName = req.body.last_name;
  var sex = req.body.sex;
  var role = req.body.role;

  if (phoneNumber == null) {
    phoneNumber = "";
  }

  req.checkBody(username, 'Username is required to register').isEmpty();
  req.checkBody(email, 'Email address is required to register').isEmpty();
  req.checkBody(password, 'Password is required to register').isEmpty();
  req.checkBody(firstName, 'First name is required to register').isEmpty();
  req.checkBody(middleName, 'Middle name is required to register').isEmpty();
  req.checkBody(lastName, 'Last name is required to register').isEmpty();


  //check errors
  var errors = req.validationErrors();

  if (errors) {
    req.flash('error_msg', 'Please enter all required fields to register');
    res.render('users/register', {
      error: errors
    });
  } else {

    var newUser = new User({
      username: username,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      sex: sex,
      country: country,
      region: region,
      district: district,
      ward: ward,
      street: street,
      role: role
    });

    User.addUser(newUser, (err, user) => {
      if (err) {
        req.flash('error_msg', 'There was an error in registeration', err);
        res.redirect('users/login');
      } else {
        user = newUser;
        req.flash('success_msg', 'You have been successfully registered');
        res.redirect('/');
      }
    });
  }
});
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(function (username, password, done) {
  User.getUserByUsername(username, function (err, user) {
    if (err) throw err;
    if (!user) {
      return done(null, false, {
        message: 'Unknown user'
      });
    }

    User.comparePassword(password, user.password, function (err, isMatch) {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'User does not match password'
        });
      }
    });
  });
})),


router.post('/login', passport.authenticate('local', {
   failureRedirect: '/users/login',
   failureFlash: 'Invalid username or password',

}),

function (req, res){
  req.flash('success msg', 'You are now logged in');
  res.redirect('/dashboard'),
                   

router.get('/logout',(req,res)=>{

  req.logout();
  req.flash('sucess','you log out successfully');
  res.redirect('/login');
});

router.get('/profile', passport.authenticate('jwt', {
  nsession: false
}), (req, res, next) => {
  if (req.user != null) {
    res.json({
      success: true,
      user: req.user
    });
  } else {
    res.json({
      success: false,
      user: null
    });
  }
});

router.get('/forgot', (req, res) => {
  res.render('users/forgot', {
    user: req.user
  });
});

router.post('/forgot', (req, res) => {

  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({
        email: req.body.email
      }, function (err, user) {
        if (!user) {
          req.flash('error_msg', 'No account with that email address exists');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 
        user.save(function (err) {
          if (err) {
            req.flash('error_msg', 'No account with that email address exists');
            return res.redirect('/forgot');
          } else
            done(err, token, user);
        });
      });
    },
    function (token, user, done) {

      var transporter = nodemailer.createTransport({
        host: 'mail.mindtapcreative.co.tz',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: constants.EMAIL_RESET,
          pass: constants.PASS_RESET
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // setup email data with unicode symbols
      var mailOptions = {
        from: '<info@mindtapcreative.co.tz>',
        to: user.email,
        subject: 'Bus-Tv Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/users/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log('The error reset is ', err);
          req.flash('error_msg', 'There was an error sending password reset details to' + user.email);
          return console.log(err);
        } else {
          req.flash('success_msg', 'An e-mail reset has been sent to ' + user.email + ' with further instructions on how to reset a password');
          done(err, 'done');
        }
      });
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function (req, res) {

  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (!user) {
      req.flash('error_msg', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('users/reset', {
      user: req.user,
      token: req.params.token
    });
  });
});

router.post('/reset/:token', function (req, res) {

  async.waterfall([
    function (done) {
      User.findOne({
        resetPasswordToken: req.body.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function (err, user) {
        if (!user) {
          req.flash('error_msg', 'Password reset token is invalid or has expired');
          return res.redirect('/login');
        }

        user.password = bcrypt.hashSync(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function (err) {
          if (err) {
            req.flash('error_msg', 'Password was not changed, please retry later');
            return res.redirect('/login');
          } else {
            done(err, user);
          }
        });
      });
    },
    function (user, done) {

      var transporter = nodemailer.createTransport({
        host: 'mail.mindtapcreative.co.tz',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: constants.EMAIL_RESET,
          pass: constants.PASS_RESET
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // setup email data with unicode symbols
      var mailOptions = {
        from: '<info@mindtapcreative.co.tz>',
        to: user.email,
        subject: 'Password Changed, Bus-Tv',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed successful\n'
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log('The error reset is ', err);
          req.flash('error_msg', 'There was an error sending password reset details to' + user.email);
          return console.log(err);
        } else {
          req.flash('success_msg', 'Your password has been changed successfully');
          done(err);
        }
      });
    }
  ], function (err) {
    res.redirect('/');
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
}),
module.exports = router;