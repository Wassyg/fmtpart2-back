//// SETUP OF DATABASE SCHEMA ////
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User DB
var userSchema = mongoose.Schema({
    userFirstName: {
      type: String
    },
    userLastName: {
      type: String
    },
    userEmail: {
      type: String,
      required: true
    },
    userPassword:{
      type: String,
      required: true
    },
    userTelephone : {
      type: String,
      required: true
    },
    userTattooDescription: {
      type: String,
      required: true
    },
    userAvailability : {
      type: String,
      required: true
    },
    userFavoriteTattoo : [{
      favTattoos: {
        type: Schema.Types.ObjectId,
        ref:'tattoos'
      }
    }],
    userFavoriteArtist : [{
      favArtists: {
        type: Schema.Types.ObjectId,
        ref:'artists'
      }
    }]
});
module.exports = UserModel = mongoose.model('users', userSchema);
