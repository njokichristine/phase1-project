//Your server/port setup, and server-side script boilerplate. (Requires a bash terminal and installation of Node.js, which includes NPM library)
//Remember to use the terminal to init npm and get the modules that you'll require:
/*
npm init
npm install express
npm install -g nodemon
npm install body-parser
*/


const express = require("express"); //the magick that is going to make all of our get and post requests work.
const bodyParser = require("body-parser"); //required to parse (target) html elements by their name tags. May be a native module in the future
const https = require("https"); //Native node module,. need to require when defining but doesn't need npm install.
const app = express() //calling express. Every app. below is express, infused intom your js file name.
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));


//get 1
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
})


//post 1
app.post("/", function(req, res) {
    console.log("Successfully posting to index: signup.html")
})


//server listening on port 3000.
app.listen(3000, function() {
    console.log("Server running on localhost, port 3000")
})
