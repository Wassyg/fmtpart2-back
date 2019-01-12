var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var options = { connectTimeoutMS: 5000, useNewUrlParser: true };
var cloudinary = require('cloudinary');
var fs = require('fs');
var bcrypt = require('bcryptjs');

//Load the DB user setup
var dbuser='fitzfoufou';
var dbpassword='lacapsule1';
mongoose.connect('mongodb://'+dbuser+':'+dbpassword+'@ds039301.mlab.com:39301/findmytattoo',
    options,
    function(err) {
     console.log(err);
    }
);
//Load the cloudinary information
cloudinary.config({
  cloud_name: "fulltattooedjacket",
  api_key: '457899133511257',
  api_secret: '7YCQsMJ8YUBk1a2-EZHfcD4xV7E'
});

//load User model, Artist model, Lead model, Tattoo model
const User = require('./models/User');
const Artist = require('./models/Artist');
const Tattoo = require('./models/Tattoo');
const Lead = require('./models/Lead');

//// USEFUL FUNCTIONS ////

//Function to shuffle the list of tattoos and artists -- unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle : https://github.com/coolaj86/knuth-shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

var ArtistDB = [
  {
    artistNickname : "Bichon",
    artistCompanyName : "The Golden Rabbit Tattoo",
    artistAddress: "10 Rue Gambey, 75011 Paris",
    artistDescription: "Après un passage par le graphisme, Bichon s'est créé son propre style : épuré, fluide et élégant.",
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
 }
];



//// Enrichissement de la base de données tatoueurs avec coordonnées GPS ////
// To learn more on how to convert addresses to coordinates, check this simple website : https://dzone.com/articles/mapboxs-api-to-geocode-data-to-get-location-inform


var ArtistDBAddress = ArtistDB.map(a=>a.artistAddress);

// for (var i = 0; i < ArtistDBAddress.length; i++) {
//   var j=0;
//   var k=0;
//   request('https://api.mapbox.com/geocoding/v5/mapbox.places/'+ ArtistDBAddress[i]+'.json?access_token=pk.eyJ1IjoiZml0emZvdWZvdSIsImEiOiJjam9nMGlkMXowOTkzM3h0N3E5am45b3hxIn0.IBgvst88EucTyqijWWnpSg', function(error, response, body){
//     addressInfo=JSON.parse(body);
//     ArtistDB[j].artistAddressLat = addressInfo.features[0].center[1];
//     ArtistDB[j].artistAddressLon = addressInfo.features[0].center[0];
//     console.log(ArtistDB[j].artistComputerPhotoLink);
//     cloudinary.v2.uploader.upload(ArtistDB[j].artistComputerPhotoLink, function(error, result){
//       console.log(result.secure_url, error);
//       ArtistDB[k].artistPhotoLink = result.secure_url;
//       var newArtist = new ArtistModel (ArtistDB[k]);
//       newArtist.save(
//         function (error, artist) {
//           console.log(artist);
//         }
//       );
//       k++;
//     });
//     j++;
//   });
// }

// Tattoo DB but change the addresses
// var TattooPhotoDBBichon = fs.readdirSync('../FindMyTattooFront/public/tatouagesBichon/');
// var TattooPhotoDBPrincesse = fs.readdirSync('../FindMyTattooFront/public/tatouagesPrincess/');
//
// var TattooDB = new Array(TattooPhotoDBBichon.length+ TattooPhotoDBPrincesse.length).fill({});

//Bichon tattoos
// for (var i = 0; i < TattooPhotoDBBichon.length; i++) {
//   var j =0;
//   cloudinary.v2.uploader.upload('../FindMyTattooFront/public/tatouagesBichon/'+TattooPhotoDBBichon[i], function(error, result){
//     console.log(result.secure_url, error);
//     TattooDB[j].tattooPhotoLink = result.secure_url;
//     TattooDB[j].artistID = '5bedb2149081e52c98f7b826';
//     TattooDB[j].tattooStyleList = ["Japopnais","Postmodern"];
//     var newTattoo = new Tattoo (TattooDB[j]);
//     newTattoo.save(
//       function (error, tattoo) {
//         console.log(tattoo);
//       }
//     );
//     j++;
//   });
// }

//Princess tattoos
// for (var i = 0; i < TattooPhotoDBPrincesse.length; i++) {
//   var j =0;
//   cloudinary.v2.uploader.upload('../FindMyTattooFront/public/tatouagesBichon/'+TattooPhotoDBBichon[i], function(error, result){
//     console.log(result.secure_url, error);
//     TattooDB[j].tattooPhotoLink = result.secure_url;
//     TattooDB[j].artistID = '5bedb2159081e52c98f7b827';
//     TattooDB[j].tattooStyleList = ["Tribal","OldSchool"];
//     var newTattoo = new Tattoo (TattooDB[j]);
//     newTattoo.save(
//       function (error, tattoo) {
//         console.log(tattoo);
//       }
//     );
//     j++;
//   });
// }

//// ROUTES ////

// Route to get all artists
router.get('/artists', function(req, res) {
  Artist.find(
    function (err, artists) {
      res.json(artists);
    })
});


//Route to enrich the Artist DB in one shot
// router.post('/artists', function(req, res){
//
//   for(var i = 0; i< ArtistDB.length; i++){
//     var newArtist = new ArtistModel (
//        ArtistDB[i]
//     )
//     newArtist.save(
//       function(err, artist){
//     console.log("err", err);
//     console.log("artist", artist);
//         ArtistModel.find(
//            function (err, artists) {
//              res.send(artists);
//             })
//     })
//   }
// })

// Route to get all tattoos from specific artist
router.get('/tattoosfromartist', function(req, res) {
  Tattoo.find(
    {artistID: req.query.artistID},
    function (err, tattoos) {
      res.json(shuffle(tattoos));
    }
  )
});

// Route to get all tattoos
router.get('/tattoos', function(req, res) {
  Tattoo.find(
    function (err, tattoos) {
      res.json(shuffle(tattoos));
    }
  )
});

// Route to create new user
var salt = "$2a$10$rx6.LcM0Eycd3JfZuRVUsO"; //To crypt the user password
router.post('/signup', function(req, res) {
    //console.log(req.body);
  User.findOne(
    {userEmail: req.body.userEmail},
    function (err, user) {

      if (user) {

        res.json({
          signup : false,
          result : "alreadyInDB",
        });
      } else{
        var hash = bcrypt.hashSync(req.body.userPassword, salt);
        var newUser = new User ({
          userFirstName: req.body.userFirstName,
          userLastName: req.body.userLastName,
          userEmail: req.body.userEmail,
          userPassword: hash,
          userTelephone : "",
          userTattooDescription: "",
          userAvailability : "",
          userFavoriteTattoo : [],
          userFavoriteArtist : [],
          });
        newUser.save(
          function (err, user) {
            if (err){
              res.json({
                signup : false,
                result : err
              })
            } else {
              res.json({
                signup : true,
                result : user,
              })
            }
          }
        );
      }
    }
  )
});

// Route to log in new user
router.post('/signin', function(req, res) {
  console.log("req.body received in the backend", req.body);
  var hash = bcrypt.hashSync(req.body.userPassword, salt);
  User.findOne(
    {userEmail: req.body.userEmail, userPassword: hash},
    function (err, user) {
      if (user) {
        res.json({
          signin : true,
          result : user,
        });
      } else{
        User.findOne(
          {userEmail: req.body.userEmail},
          function (err, user) {
            if (user) {
              res.json({
                signup : false,
                result : "wrongPassword",
              });
            } else {
              res.json({
                signin : false,
                result: err
              });
            }
          }
        )
      }
    }
  )
});

// Route to update user favorite tattoos when he likes a tattoo
router.put('/userliketattoo', function(req, res) {
  console.log("req.body userliketattoo 275",req.body);
  User.updateOne(
    {_id: req.body.user_id},
    {$addToSet: {userFavoriteTattoo: req.body.favTattooID}},
    function (err, raw) {
      if(err){
        res.json({likeTattoo : false})
      } else{
        res.json({likeTattoo: true});
      }
    });
    Tattoo.updateOne(
      {_id: req.body.favTattooID},
      {$addToSet: {user: req.body.user_id}},
      function (err, raw) {
        if(err){
          console.log("err Tattoo update with user information",err);
        }else{
          console.log("user added to tattoo");
        }
      }
    )
});



// Route to update a user favorite tattoos when he dislikes a tattoo
router.put('/userdisliketattoo', function(req, res) {
  User.updateOne(
    {_id: req.body.user_id},
    {$pull: {userFavoriteTattoo: req.body.favTattooID}},
    function (err, raw) {
      if(err){
        // console.log('TATTOO NA PAS ETE SUPPRIME');
        res.json({dislikeTattoo : false})
      } else{
        // console.log('TATTOO A BIEN ETE SUPPRIME');
        res.json({dislikeTattoo: true});
      }
    }
  )
});

// Route to update user favorite artists when he likes an artist
router.put('/userlikeartist', function(req, res) {
  //console.log("req.body userlikeartist 340", req.body);

      User.updateOne(
        {_id: req.body.user_id},
        {$addToSet: {userFavoriteArtist: req.body.favArtistID}},
        function (err, raw) {
          if(err){
            res.json({likeArtist : false})
          } else{
            res.json({likeArtist: true});
          }
        }
      );
    Artist.updateOne(
      {_id: req.body.favArtistID},
      {$addToSet: {user: req.body.user_id}},
      function (err, raw) {
        if(err){
          console.log("err Artist update with user information",err);
        } else{
          console.log("user added to artist");
        }
      }
    )

});

// router.get('/tattooToBeChecked', function(req, res) {
//   Tattoo.find(
//     {_id: req.query.id},
//     function(err, tattoo){
//         res.json({tattoo})
//     }
//   )
// })


// Route to update user favorite artists when he dislikes an artist
router.put('/userdislikeartist', function(req, res) {
  console.log(req.body);
  User.updateOne(
    {_id: req.body.user_id},
    {$pull: {userFavoriteArtist: req.body.favArtistID}},
    {multi: true},
    function (err, raw) {
      if(err){
        res.json({dislikeArtist : false})
        //console.log('ARTIST A BIEN ETE SUPPRIME');
      } else{
        //console.log('ARTIST A BIEN ETE SUPPRIME');
        res.json({dislikeArtist: true});
      }
    }
  )
});
//Route to get fav tattoos and artists for each users
router.get('/userFavTattoos', function(req,res){
  User.findOne(
    {_id: req.query.user_id},
     function(err, user){
      if (err){
        res.json({user : false})
      } else {
        // chercher tous les éléments dans un array sans boucler grâce au $in
          Tattoo.find(
          {_id: {$in: user.userFavoriteTattoo}},
          function(err, tattoos){
               if(err){
                 res.json({err});
               }else{
                res.json({
                  user : true,
                  result : tattoos
                  });

              }
            }
          );
      }
    }
  )
});

router.get('/userFavArtists', function(req,res){
  User.findOne(
    {_id: req.query.user_id},
     function(err, user){
      if (err){
        res.json({user : false})
      } else {
        // chercher tous les éléments dans un array sans boucler grâce au $in
          Artist.find(
          {_id: {$in: user.userFavoriteArtist}},
          function(err, artist){
               if(err){
                 res.json({err});
               }else{
                res.json({
                  user : true,
                  result : artist
                  });

              }
            }
          );
      }
    }
  )
});


//Route to get all information of a specific user
router.get('/user', function(req, res) {
  User.findOne(
    {_id: req.query.user_id},
    function (err, user) {
      if (err){
        res.json({user : false})
      } else {
        res.json({
          user : true,
          result : user
        });
      }
    }
  )
});

//Route to get all information of a specific artist
router.get('/artist', function(req, res) {
  Artist.findOne(
    {_id: req.query.artist_id},
    function (err, artist) {
      if (err){
        res.json({artist : false})
      } else {
        console.log(artist);
        res.json({
          artist : true,
          result : artist
        });
      }
    }
  )
});


//Route to create a new lead from user to artist
router.post('/newlead', function(req, res) {
  //Create a new lead
  var today = new Date();
  var newLead = new Lead ({
    dateLead: today,
    userID: req.body.user_id,
    artistID: req.body.artist_id,
    userAvailability : req.body.userAvailability,
    userTattooDescription : req.body.userTattooDescription,
  })
  newLead.save(
    function (error, lead) {
      User.updateOne(
        {_id: req.body.user_id},
        {userTelephone: req.body.userTelephone},
        function (err, raw) {
          if(err){
            res.json({
              updateUser : false,
              result : lead
            })
          } else{
            res.json({
              updateUser: true,
              result : lead
            });
          }
        }
      )
    }
  )
});

// Initial route
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

//Route to delete all tattoos - just for testing
router.delete('/deletetattoos', function(req,res){
  Tattoo.remove(
    {},
    function(error){
      res.json({result: "ok"})
    }
  )
});

//Route to get users - just for testing
router.get('/users', function(req, res) {
  User.find(
    function (err, users) {
        console.log(users);
        res.json(users);
    }
  )
});
module.exports = router;
