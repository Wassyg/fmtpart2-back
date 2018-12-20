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
      type: String
    },
    userTattooDescription: {
      type: String
    },
    userAvailability : {
      type: String
    },
    userFavoriteTattoo : [{
        type: Schema.Types.ObjectId,
        ref:'tattoos'
    }],
    userFavoriteArtist : [{
        type: Schema.Types.ObjectId,
        ref:'artists'
    }]
});
module.exports = User = mongoose.model('users', userSchema);
