var jwt = require('jsonwebtoken');
var User = require('../models/user');
var constants = require('../config/constants');

module.exports = (req, res, next) => {

    var sessionToken = req.headers.authorization;

    if (!req.body.user && sessionToken) {
        //jwt check
        jwt.verify(sessionToken, constants.JWT_SECRET, (err, decodedId) => {
            if (decodedId) {
                User.findOne({
                    _id: decodedId
                }).then(
                    (user) => {
                        req['user'] = user;
                        next();
                    }, (err) => {
                        res.json({
                            success: false,
                            message: 'Not authorized'
                        });
                    });
            } else {
                res.json({
                    success: false,
                    message: 'Not authorized'
                });
            }
        });
    } else {
        next();
    }
};