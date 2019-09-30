var express = require('express');
var router = express.Router();
var moment = require('moment');
//var User = require('../models/user');
var School = require('../models/school');
var school_model = School.model('School');


router.get('/', (req, res) => {
  school_model.find({}, (err, result) => {
    if (err) {
      req.flash('error_msg', 'There was an error : '+err);
      res.redirect('/');
    } else {
      res.render('schools', {
        schools: result,
        moment: moment
      });
    }
  });
});

router.get('/add', function (req, res, next) {
  res.render('schools/add');
});

router.post('/add', function (req, res, next) {

  var title = req.body.title;
  var no_girls = req.body.no_girls;
  var no_boys = req.body.no_boys;
  var street_address = req.body.street_address;
  var ward = req.body.ward;
  var district = req.body.district;
  var region = req.body.region;
  var headmaster = req.body.headmaster;
  var coordinator = req.body.coordinator;
  var phoneNumber = req.body.phoneNumber;
  req.checkBody(title, 'title is needed to register a school').isEmpty();
  req.checkBody(no_girls, 'no of girls is needed to register a school').isEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error_msg', 'There are missing parameters');
    res.redirect('add');
  } else {
    var school = new School();
    school.title = title;
    school.no_girls = no_girls;
    school.no_boys = no_boys;
    school.street_address = street_address;
    school.ward = ward;
    school.district = district;
    school.region = region;
    school.headmaster = headmaster;
    school.coordinator = coordinator;
    school.phoneNumber = phoneNumber;
    school.save(function (err) {
      if (err) {
        req.flash('error_msg', 'Failed to save schools details : ' + err);
        res.redirect('add');
      } else {
        req.flash('success_msg', 'School saved successful');
        res.redirect('/');
      }
    });
  }
});

module.exports = router;