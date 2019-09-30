var db = require('../config/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcryptjs = require('bcryptjs');
var mongooseHidden = require('mongoose-hidden')();

var UserSchema = new Schema({
    username : {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'normal'
    },
    firstName:{
        type: String
    },
    lastName: {
        type: String
    },
    middleName: {
        type: String
    },
    sex: {
        type: String,
        default: 'M'
    },
    district: {
        type: String
    
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    region: {
        type: String,
        default: 'Dar es salaam'
    },
    street: {
        type: String
    },
    country: {
        type: String,
        default: 'United Replic of Tanzania'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

UserSchema.plugin(mongooseHidden);
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.getUserByUsername = function (username, callback) {
    var query = {
        username: username
    };
    User.findOne(query, callback);
};

module.exports.addUser = function (newUser, callback) {
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcryptjs.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};