var db = require('../config/db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResponseSchema = new Schema({
    id:String,
    disabled_latrines: String,
    Hygiene_education : String,
    Latrines_availability : String,
    number_of_boys_latrines : String,
    number_of_girls_latrines : String,
    water_supply : String
});

var schoolSchema = new Schema({
    title: {
        type: String
    },
    no_girls: {
        type: Number,
        default: 0
    },
    no_boys:{
        type:Number,
        default: 0
    },
    street_address: {
        type: String,
        default: ''
    },
    ward: {
        type: String,
        default: ''
    },
    district: {
        type: String,
        default: ''
    },
    region: {
        type: String,
        default: 'Dar es salaam'
    },
    headmaster: {
        type: String
    },
    coordinator : {
        type: String
    },
    phoneNumber : {
        type: String
    },

    created: {
        type: Date,
        default: Date.now
    }
    

});

mongoose.model('School', schoolSchema);
mongoose.model('Response', ResponseSchema);

module.exports = mongoose;