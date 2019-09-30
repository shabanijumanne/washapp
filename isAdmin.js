var jwt = require('jsonwebtoken');
var User = require('../models/user');
var constants = require('../config/constants');
var passport = require('passport');

module.exports = passport.authenticate('jwt', {session: false} ), (req, res, next) => {
    if (req.user != null) {
        if(req.user.userType == 'isAdmin'){
            res.json({
                success: true,
                isAdmin: true
            });
        }else{
            res.json({
                success: true,
                isAdmin: false
            });
        }
    } else {
        res.json({
            success: false,
            isAdmin: false
        });
    }
};