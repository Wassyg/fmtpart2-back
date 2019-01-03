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
    userFavoriteTattoo : [
    {
      tattoo: {
        type: Schema.Types.ObjectId,
        ref:'tattoos'
        }
    }],
    userFavoriteArtist : [
      {
        artist: {
        type: Schema.Types.ObjectId,
        ref:'artists'
        }
    }],
    userFavID: {
      type: String
    },
    avatar: {
      type: String
    }
});
module.exports = User = mongoose.model('users', userSchema);
