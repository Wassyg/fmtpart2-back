//// SETUP OF DATABASE SCHEMA ////
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tattoo DB
var tattooSchema = mongoose.Schema({
    tattooPhotoLink: {
      type: String,
      required:true
    },
    tattooStyleList: [],
    artistID: {
      type: String,
      required:true
    },
    favTattooID: {
      type: String
    },
    user:[{
      user: {
        type: Schema.Types.ObjectId,
        ref:'users'
      }
    }]
});
module.exports = Tattoo = mongoose.model('tattoos', tattooSchema);
