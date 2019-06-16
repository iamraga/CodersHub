const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//BodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//DB Config
const db = require('./config/keys').mongoURI;

//Connect to Mongo DB
mongoose
    .connect(db, {useNewUrlParser: true})
    .then(() => console.log("Mongo DB connected!"))
    .catch(err => console.log("Error" + err));
app.get('/', (request, response) => response.send("Hello World!"));

//Passport middleware
app.use(passport.initialize());

//Passport config
require('./config/passport.js')(passport);

//Use Routes
app.use("/api/users", users); //This will send it to users js file. There its enough to configure "/tests/"
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000; //Get environment variable for port while deploying on heroku

app.listen(port, () => console.log(`running on port ${port}`));