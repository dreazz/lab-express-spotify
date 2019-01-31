const express = require('express');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const clientId = '0b379bc4cfe14f3988ce72f98d33f121';
const clientSecret = '91bcfe87dc4a41499ed5d04e159ad462';

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
// Antes era asi clientId : clientId, clientSecret : clientSecret.... pero Airbnb Eslint
});

spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch((error) => {
    console.log('Something went wrong when retrieving an access token', error);
  });



const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));


// setting the spotify-api goes here:






// the routes go here:
app.get('/', (req, res) => {
  spotifyApi.searchArtists('el fary')
    .then((data) => {
      const artists = data.body.artists.items;
      res.render('index', { artists });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));