//// SETUP OF DATABASE SCHEMA ////
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tattoo DB
var tattooSchema = mongoose.Schema({
    tattooPhotoLink: {
      type: String,
      required:true
    },
    tattooStyleList: [{
      type: String
    }],
    artistID: {
      type: String,
      required:true
    },
    favTattooID: {
      type: String
    }
});
module.exports = TattooModel = mongoose.model('tattoos', tattooSchema);