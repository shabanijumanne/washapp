var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');
var constants = require('../config/constants');

module.exports = function (passport) {

    console.log('The passport process started ... ');
    
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = constants.JWT_SECRET;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log('Payload is ', jwt_payload);
        User.getUserById(jwt_payload.user, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};