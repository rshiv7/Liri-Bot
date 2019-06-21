require("dotenv").config();

var keys = require("./keys.js");
var moment = require('moment');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

function runSpotify(input) {
    spotify.search({
        type: 'track',
        query: input,
        limit: 1
    },
        function (err, data) {
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

function runBandsInTown(input) {
    var request = require('request');
    request("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp", function (error, response, body) {
        if (error) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
        }
        results = JSON.parse(body);
        if (results.length < 1) {
            console.log('try some other atrist.\n');
        } else {
            console.log('\n Time to plan for the upcoming shows and get some days off from work for ' + input + '\n');
            for (let i = 0; i < 5 && i < results.length; i++) {
                console.log('Venue: ' + results[i].venue.name + '\n' +
                    'Location: ' + results[i].venue.city + ', ' +
                    results[i].venue.country);
                var partyDate = results[i].datetime.split('T')[0];
                partyDate = moment(partyDate, 'YYYY-MM-DD').format('MMM DD, YYYY');
                if (partyDate) {
                    console.log('Date: ' + partyDate + '\n');
                } else {
                    console.log('Date: Call someone else to find out..... TBA')
                }
            }
        }
    });
};