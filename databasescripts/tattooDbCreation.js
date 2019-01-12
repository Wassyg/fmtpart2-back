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


//load User model, Artist model, Lead model, Tattoo model
const Artist = require('../routes/models/Artist');
const Tattoo = require('../routes/models/Tattoo');

//// INITIAL DATABASE ////

// Function to create a tattoo database from local photo files
function tattooDBCreationWithLocalImages(path, artistNickname){
  return new Promise((resolve, reject) => {
    const tattooListPhotos = fs.readdirSync(path);
    let tattooDB = tattooListPhotos.map((tattoo) => {
      return {
        tattooComputerPhotoLink: path+tattoo,
        artistNickname : artistNickname
      }
    });
    resolve(tattooDB);
  });
}
// Function to get new tattoo info from scraping photoIndex is for each picture coming from the same artist
// function getNewElementByScraping(url, photoIndex){
//   return new Promise((resolve, reject) => {
//     request(url,
//       function(err, response, body){
//         let $ = cheerio.load(body);
//         let element = {
//           tattooComputerPhotoLink : "https://www.tattoome.com"+$('.carousel-inner img')[photoIndex].attribs.src,
//           artistNickname : $('.studio_tatoueurs li:nth-child(1):first-child').text(),
//         }
//         resolve(element);
//       }
//     )
//   });
// }
// Function to add to a database several tattoos from several artists from scraping
// async function tattooDBScrapping(scrappingLinks, database){
//   // Go through several artists url pages
//   for (let i = 0; i < scrappingLinks.length; i++) {
//     // Go through several photos of one artist
//     for (let j = 1; j < 6; j++) {
//       let newElement = await getNewElementByScraping(scrappingLinks[i], j);
//       database.push(newElement);
//     }
//   }
//   console.log(database);
// }

//// LINKS OF ARTISTS TO SCRAP ////
// var tattooLink = [
//   "https://www.tattoome.com/fr/org/2873/lagrif-bleue",
//   "https://www.tattoome.com/fr/org/134/kalie-art-tattoo#",
//   "https://www.tattoome.com/fr/org/2901/marlene-le-cidre-",
//   "https://www.tattoome.com/fr/org/2872/chez-meme",
//   "https://www.tattoome.com/fr/org/236/soul-vision-tattoo"
// ];

// Function to concatenate the two ways of collecting tattoos
function tattooDBCreation() {
  return new Promise(async function(resolve, reject) {
    //Creation of database with local files
    const TattooDBBichon = await tattooDBCreationWithLocalImages('../public/images/tatouagesBichon/', 'Bichon');
    const TattooDBPrincessM = await tattooDBCreationWithLocalImages('../public/images/tatouagesPrincessM/', 'Princess Madness');
    const TattooDBJulienSamou = await tattooDBCreationWithLocalImages('../public/images/tatouagesJulien/', 'Julien Samou');
    let TattooDB = TattooDBBichon.concat(TattooDBPrincessM).concat(TattooDBJulienSamou);
    // Creation of database with web files from SCRAPING
    //tattooDBScrapping(tattooLink, TattooDB);
    console.log(TattooDB);
    resolve (TattooDB)
  });
}



//// ADD EXTRA INFORMATION TO DATABASE ////
function pushTattooPhotoOnCloudinary(tattoo, tattooIndex) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(tattoo.tattooComputerPhotoLink, {public_id: "tattoos/tattoo_"+tattooIndex}, (error, result) => {
      if (error) {
        reject(error);
      } else {
        console.log(result.secure_url);
        tattoo.tattooPhotoLink = result.secure_url;
        resolve(tattoo);
      }
    });
  });
}

function addArtistInfoToTattoo(tattoo, artistNickname) {
  return new Promise((resolve, reject) => {
    Artist.findOne(
      {artistNickname : artistNickname},
      function (err, artist) {
        tattoo.artistID = artist._id;
        tattoo.tattooStyleList = artist.artistStyleList;
        resolve(tattoo)
      }
    );
  });
}

function createNewTattooInDB(tattoo){
  return new Promise((resolve, reject) => {
    let newTattoo = new Tattoo (tattoo);
    newTattoo.save(
     (error, tattoo) => {
        console.log(tattoo);
        resolve()
      }
    );
  });
}

const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

async function tattooDBEnrichment() {
  let TattooDB = await tattooDBCreation();
  await timeoutPromise(60000);
  TattooDB
  .forEach(async function(tattoo, i){
    let tattooWithCloud = await pushTattooPhotoOnCloudinary(tattoo, i);
    let tattooWithArtist = await addArtistInfoToTattoo(tattooWithCloud, tattooWithCloud.artistNickname);
    await createNewTattooInDB(tattooWithArtist);
  })
}

////// TO LAUNCH THE CREATION OF DATABASE : UNCOMMENT THE LINE BELOW /////
//vérifier si vraiment besoin de tattooDBCreation() avant !
tattooDBEnrichment();
