//// SETUP OF DATABASE SCHEMA ////
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Leads DB
var leadSchema = mongoose.Schema({
    dateLead: Number,
    userID: String,
    artistID: String,
    artistID: String,
    userAvailability : String,
    userTattooDescription : String,
});
module.exports = LeadModel = mongoose.model('leads', leadSchema);
