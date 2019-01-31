const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const expressLayouts = require("express-ejs-layouts");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const clientId = "0b379bc4cfe14f3988ce72f98d33f121";
const clientSecret = "91bcfe87dc4a41499ed5d04e159ad462";

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret
  // Antes era asi clientId : clientId, clientSecret : clientSecret.... pero Airbnb Eslint
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

const app = express();
app.use(expressLayouts);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.set("layout", "layouts/layout");

app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true })); // body parser configuration

// setting the spotify-api goes here:

// the routes go here:
app.get("/", (req, res) => {
  res.render("index", { artists: null });
});
//works with the param and
// app.get("/param/:id", (req, res) => {
//   const { id } = req.params; //is the same as id = req.params.id but is deconstructing it

//   res.send(`my param is ${id}`);
// });

app.post("/", (req, res) => {
  const artistName = req.body.artist; // reads param body
  if (!req.body.artist) {
    res.redirect("/");
  }
  console.log(artistName);
  spotifyApi
    .searchArtists(artistName)
    .then(data => {
      const artists = data.body.artists.items;
      const artistId = artists[0].id;
      

      spotifyApi.getArtistAlbums(artistId).then(albumsData => {
        let albumsId = []
        let tracks;
        const albums =  albumsData.body.items
       albums.forEach((album) =>{
        albumsId.push(album.id)
        
        })
        for(let i =0 ; i < albumsId.length; i++){
        spotifyApi.getAlbumTracks(albumsId[i]).then(songs => {
          // tracks = songs.body.item

            console.log(songs.body.items)
            albums[i].songs = songs.body.items
          })
        }
        const dataFromApi = {
          artists: artists[0],
          albums,
         // tracks
        }
        console.log(dataFromApi)
        res.render("index", dataFromApi);
      
      });
      
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});
//rendering the result of the form with a query in the url
// app.get("/", (req, res) => {
// const artistName = req.query.artist; // reads query
// spotifyApi
//   .searchArtists(artistName)
//   .then(data => {
//     const artists = data.body.artists.items;
//   res.render("index", { artists });
//   })
//   .catch(err => {
//     console.log("The error while searching artists occurred: ", err);
//   });
// });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
