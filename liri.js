require("dotenv").config();

var keys = require("./keys.js");
var moment = require('moment');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];

var input = process.argv.slice(3).join(' ');


runLiRi(command, input)
function runLiRi(command, input) {
    switch (command) {
        case 'concert-this':
            input ? runBandsInTown(input) : runBandsInTown("Odesza")
            break;
        case 'spotify-this-song':
            input ? runSpotify(input) : runSpotify(" Ace of Base The Sign")
            break;
        case 'movie-this':
            input ? runOMDB(input) : runOMDB("Mr. Nobody")
            break;
        case 'do-what-it-says':
            runRandom(command, input);
            break;
        default:
            help()
    };
};


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

function runOMDB(input) {
    var request2 = require('request');
    request2('http://www.omdbapi.com/?apikey=trilogy&t=' + input, function (error, response, body) {
        if (error) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
        } else {
            movie = JSON.parse(body);
            console.log("\n\nTitle: " + movie.Title);
            console.log("Year: " + movie.Year);
            console.log("IMDB Rating: " + movie.imdbRating);
            console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
            console.log("Country: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("Plot: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
        }
    });
};
function runRandom(command, input) {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error)
        }
        data = data.split('"');
        var dataArr = data;
        command = dataArr[0].split(',')[0];
        input = dataArr[1];
        runLiRi(command, input);
    });
};

function help() {
    console.log(
        'In order to run Liri please ask the following\n' +
        'For concerts around you please use the command\n' +
        'concert-this "artist", such as concert-this macklemore\n' +
        'For songs you want info about please use the command\n' +
        'spotify-this-song "song name here", such as spotify-this-song welcome to the party\n' +
        'For movies that you want to find more info about please use the command\n' +
        'movie-this "movie name", such as movie-this Deadpool 2\n' +
        'For a random command please use\n' +
        'do-what-it-says\n');
};