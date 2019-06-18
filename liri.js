require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

// Argv the desired application
var argv = process.argv;
var app = process.argv[2];

// Handle multiword query
var query = process.argv.slice(3).join(" ");

// Create OMDB appropriate query value
var multiName = "";

// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (var i = 3; i < argv.length; i++) {
    if (i > 3 && i < argv.length) {
        multiName = multiName + "+" + argv[i];
    } else {
        multiName += argv[i];
    }
}

// Switch function to capture user input and run appropriate function
function userInput(app, query) {
    switch (app) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("I'm not smart enough to know what this means!");
            break;
    }
}

userInput(app, query);

function concertThis() {
    console.log("");
    console.log("Stand by while I retrive concert info for " + query);
    console.log("----------");
    console.log("");

    // Use Axios to query the Bands In Town API
    axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp").then(
        function(response) {

            for (i = 0; i < response.data.length; i++) {
                console.log("Venue: " + response.data[i].venue.name);
                if (response.data[i].venue.region === "") {
                    console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                }
                else {
                    console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country);
                }
                var date = moment(response.data[i].datetime).format("MM/DD/YYYY hh:00 A");
                console.log("Date: " + date);
                console.log("");
            }
        })
        .catch(function(error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
                console.log(error.config);
        });
}

function movieThis() {
    // Handle case where no movie is entered by user
    var url = "";
    var defaultMovie = "Mr+Nobody";
    if (query === "") {
        url = "http://www.omdbapi.com/?t=" + defaultMovie + "&y=&plot=short&apikey=trilogy";
    }
    else {
        url = "http://www.omdbapi.com/?t=" + multiName + "&y=&plot=short&apikey=trilogy";
    }

    // Run a request with axios to the OMDB API with the movie specified using the multiName variable
    axios.get(url).then(
        function(response) { 
            console.log("");
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("");
        })
        .catch(function(error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

function spotifyThisSong() {
    // Handle case where no song is entered by user
    var song = "";
    if (query === "") {
        song = 'The Sign Ace Of Base';
    }
    else {
        song = query;
    }

    spotify.search({ type: 'track', query: song, limit: 10 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        for (i = 0; i < data.tracks.items.length; i++) {
            console.log("");
            console.log('Artist(s): ' + data.tracks.items[i].artists[0].name);
            console.log('Song Title: ' + data.tracks.items[i].name);
            console.log('Preview Link: ' + data.tracks.items[i].preview_url);
            console.log('Album: ' + data.tracks.items[i].album.name);
            console.log("");
        }

    });
}

function doWhatItSays() {
    // Keeping this super simple in the interest of time. If expanded to the other functions, I would write If statements to evaluate whether the line in 
    // question was Spotify, Movie, or Bands In Town related data (based on 0 position in the array post split) then throw that value to the appropriate function.
    // I had trouble with the Spotify function getting confused with no argument so just basically hard-coded it again here.  Not efficient, not elegant.  But works.
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArray = data.split(",");
            var song = dataArray[1];
            
            spotify.search({ type: 'track', query: song, limit: 10 }, function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
        
                for (i = 0; i < data.tracks.items.length; i++) {
                    console.log("");
                    console.log('Artist(s): ' + data.tracks.items[i].artists[0].name);
                    console.log('Song Title: ' + data.tracks.items[i].name);
                    console.log('Preview Link: ' + data.tracks.items[i].preview_url);
                    console.log('Album: ' + data.tracks.items[i].album.name);
                    console.log("");
                }
        
            });
        }
    });
}