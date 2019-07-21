const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

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

//Passport middleware
app.use(passport.initialize());

//Passport config
require('./config/passport.js')(passport);

//Use Routes
app.use("/api/users", users); //This will send it to users js file. There its enough to configure "/tests/"
app.use("/api/profile", profile);
app.use("/api/posts", posts);

//Server static assets if it is in production
if(process.env.NODE_ENV === 'production') {
    //Use static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const port = process.env.PORT || 5000; //Get environment variable for port while deploying on heroku

app.listen(port, () => console.log(`running on port ${port}`));