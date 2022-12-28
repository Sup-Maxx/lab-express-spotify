require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials");


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
  app.get('/',(req,res)=>{
    //res.send("why this not working?")
    res.render('index')

  })

// search for an artist
  app.get ('/artist-search', (req, res) => {
    const {artist} = req.query

    spotifyApi.searchArtists(artist)
      .then((data) => {
        const artists = data.body.artists.items
        res.render("artist-search-results", {artists, query: artists[0].name})
      })
      .catch(error => console.log("Error by searching for artists" + error))
  })

// view an album
  app.get('/albums/:artistId', (req, res) => {
    const artistId = req.params.artistId

    spotifyApi.getArtistAlbums(artistId)
      .then((data) => {
        const albums = data.body.items
        res.render("albums", {albums, query:albums[0].artists[0].name})
      })
      .catch(error => console.error("Error by retrieving artists albums" + error))
  })

 

app.listen(3000, () => console.log('Spotify project running on port 3000 🎧 🥁 🎸 🔊'));