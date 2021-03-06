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
      type:String
    }],

    artistID: {
      type: String,
      required:true
    },
    favTattooID: {
      type: String
    },
    user:[{
        type: Schema.Types.ObjectId,
        ref:'users'
    }]
});
module.exports = Tattoo = mongoose.model('tattoos', tattooSchema);
