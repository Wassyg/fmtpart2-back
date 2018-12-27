//// SETUP OF DATABASE SCHEMA ////
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Leads DB
var leadSchema = mongoose.Schema({
    dateLead: {
        type: Date,
        default : Date.now
    },
    userID: {
        type: String
    },
    artistID: {
        type: String
    },
    artistID: {
        type: String
    },
    userAvailability : {
        type: String
    },
    userTattooDescription : {
        type: String
    }
});
module.exports = Lead = mongoose.model('leads', leadSchema);
