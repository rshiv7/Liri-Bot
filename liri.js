require("dotenv").config();

var keys = require("./keys.js");
var fs = require('fs');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

function runSpotify(input) {
    spotify.search({ type: 'track', query: input, limit: 1 }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
        } else {
            song = data.tracks.items[0];
            console.log(
                '\n\nArtist: ' + song.artists[0].name + '\nSong: ' + song.name
                + '\nPreview Link: ' + song.preview_url + '\nAlbum: ' +
                song.album.name + '\n\n'
            );
        }
    });
};