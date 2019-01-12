var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var options = { connectTimeoutMS: 5000, useNewUrlParser: true };
var cloudinary = require('cloudinary');
var fs = require('fs');
var bcrypt = require('bcryptjs');

var dbuser='fitzfoufou';
var dbpassword='lacapsule1';
mongoose.connect('mongodb://'+dbuser+':'+dbpassword+'@ds039301.mlab.com:39301/findmytattoo',
    options,
    function(err) {
     console.log(err);
    }
);

cloudinary.config({
  cloud_name: "fulltattooedjacket",
  api_key: '457899133511257',
  api_secret: '7YCQsMJ8YUBk1a2-EZHfcD4xV7E'
});

//// LOAD ARTIST SCHEMA ////
const Artist = require('../routes/models/Artist');

//// INITIAL DATABASE ////
var ArtistDB = [
  {
    artistNickname : "Bichon",
    artistCompanyName : "The Golden Rabbit Tattoo",
    artistAddress: "10 Rue Gambey, 75011 Paris",
    artistDescription: "Bichon est un véritable artiste qui a su créer son propre style : épuré, fluide et élégant.",
    artistEmail: "bichontatoueur@gmail.com",
    artistComputerPhotoLink : "../public/avatarsTatoueurs/bichon.jpg",
    artistStyleList : ["DotWork", "FineLine", "BlackWork"],
    artistNote : 5,
    },
 {
   artistNickname : "Princess Madness",
   artistCompanyName : "Lez'art du Corps - Paris",
   artistAddress: "16 Rue Geoffroy-Marie, 75009 Paris",
   artistDescription: "Princess Madness s'est d'abord lancée dans la mode. Elle aime le style cartoon et les créations déjantées.",
   artistEmail: "princess-madness@hotmail.com",
   artistComputerPhotoLink : "../public/avatarsTatoueurs/princessM.jpg",
   artistStyleList : ["Cartoon", "NewSchool", "Postmodern"],
   artistNote : 5,
 },
 {
   artistNickname : "Julien Samou",
   artistCompanyName : "De l'Art ou Du Cochon",
   artistAddress: "Salon Privé Montmartre, 75018 Paris",
   artistDescription: "Julien a le graphisme dans l'oeil, ses traits sont droits et ses créations parfaitement équilibrée ",
   artistEmail: "tattoo.jsamou@gmail.com",
   artistComputerPhotoLink : "../public/avatarsTatoueurs/julienSamou.jpg",
   artistStyleList : ["Tribal", "BlackWork", "Berber"],
   artistNote : 5,
 }
];


//// USEFUL FUNCTION TO DELAY LAUNCH OF FOLLOWING FUNCTION ////
const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));



//Fonction pour ajouter adresse et coordonnées à un artiste
     // function addArtistCoordinates(artist){
     //   return new Promise((resolve, reject)=>{
     //     request('https://api.mapbox.com/geocoding/v5/mapbox.places/'+artist.artistAddress+'.json?access_token=pk.eyJ1IjoiZml0emZvdWZvdSIsImEiOiJjam9nMGlkMXowOTkzM3h0N3E5am45b3hxIn0.IBgvst88EucTyqijWWnpSg',
     //     function(err, response, body){
     //       addressInfo=JSON.parse(body);
     //       artist.artistAddressLat = addressInfo.features[0].center[1];
     //       artist.artistAddressLon = addressInfo.features[0].center[0];
     //       //console.log("artist 150", artist)
     //       resolve(artist);
     //     })
     //   })
     // }

function pushArtistPhotoOnCloudinaryAndSaveItInMLab() {
  ArtistDB.map((artist, i) =>{
    let photoPath = artist.artistComputerPhotoLink
         cloudinary.v2.uploader.upload(photoPath,
          {public_id: "artists/artist_"+i},
           function(error, result){
          if (error) {
            return console.log(error);
          } else {
            var newArtist = new Artist ({
               artistNickname: artist.artistNickname,
               artistCompanyName: artist.artistCompanyName,
               artistAddress: artist.artistAddress,
               artistDescription: artist.artistDescription,
               artistAddressLat: artist.artistAddressLat,
               artistAddressLon: artist.artistAddressLon,
               artistEmail: artist.artistEmail,
               artistPhotoLink : result.secure_url,
               artistStyleList : [{
                 style1: artist.artistStyleList[0],
                 style2: artist.artistStyleList[1],
                 style3: artist.artistStyleList[2]
               }],
               artistNote : artist.artistNote,
               favArtistID: artist.favArtistID
             });

            newArtist.save(
              function(error, artist) {
                console.log(error, artist);
          })
          }
  })
})
}


////// TO LAUNCH THE CREATION OF DATABASE : UNCOMMENT THE LINE BELOW /////
//pushArtistPhotoOnCloudinaryAndSaveItInMLab();
