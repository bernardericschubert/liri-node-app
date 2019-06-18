require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
//var dotenv = require("dotenv");

// Argv the desired application
var argv = process.argv;
var app = process.argv[2];

// Handle multiword query
var query = process.argv.slice(3).join(" ");

// Create OMDB and Spotify appropriate query value
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
            doWhatItSays(query);
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
            //console.log(response.data);
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
    // Run a request with axios to the OMDB API with the movie specified using the multiName variable
    axios.get("http://www.omdbapi.com/?t=" + multiName + "&y=&plot=short&apikey=trilogy").then(
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