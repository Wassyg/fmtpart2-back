//// SETUP OF DATABASE SCHEMA ////
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Artist DB
var artistSchema = mongoose.Schema({
    artistNickname: {
      type: String,
      required: true
    },
    artistCompanyName: {
      type: String
    },
    artistAddress: {
      type:String,
      required: true
    },
    artistDescription: {
      type:String
    },
    artistAddressLat: {
      type: Number
    },
    artistAddressLon: {
      type: Number
    },
    artistEmail:{
      type: String,
      required: true
    },
    artistPhotoLink : {
      type: String,
      required: true
    },
    artistStyleList : [{
      style1: {
        type: String,
        required: true
      },
      style2: {
        type: String
      },
      style3: {
        type: String
      }
    }],
    artistNote : {
      type: Number
    },
    favArtistID: {
      type: String
    },
    user:[{
      type: Schema.Types.ObjectId,
      ref:'users'
    }]
});
module.exports = Artist = mongoose.model('artists', artistSchema);
