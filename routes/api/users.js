const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require('passport');

//Load validation file
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Bringing User model (mongoose)
const User = require('../../models/User');
// @route   GET api/users/test
// @desc    Test user route
// @access  public route
router.get('/test', (request, response) => response.json({msg: "Users work!"}));

// @route   POST api/users/register
// @desc    Register new user route
// @access  public route
router.post('/register', (request, response) => {

    //Validate inputs
    const {errors, isValid} = validateRegisterInput(request.body);

    if(!isValid) {
        return response.status(400).json(errors);
    }
    
    User.findOne({email: request.body.email})
        .then(user => {
            if(user) {
                errors.email = "Email already available";
                return response.status(400).json(errors);
            }
            else {
                const avatar = gravatar.url(request.body.email, {
                    s: "200", //SIZE
                    r: "pg", //RATING
                    d: "mm" //Default
                })
                const newUser = new User({
                    name: request.body.name,
                    email: request.body.email,
                    avatar, //For ES6 it is enough to leave it this way
                    password: request.body.password
                });

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if(error) throw error;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => response.json(user))
                            .catch(error => console.log(error));
                    });
                })
            }
        })
        .catch(error => console.log(error));
});

// @route   GET api/users/login
// @desc    Login user / Return jwt token
// @access  public route
router.post('/login', (request, response) => {
    
    //Validate inputs
    const {errors, isValid} = validateLoginInput(request.body);

    if(!isValid) {
        return response.status(400).json(errors);
    }

    const email = request.body.email;
    const password = request.body.password;
    
    //Find user by email
    User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = "User not found!";
                return response.status(400).json(errors);
            }

            //Check password
            bcrypt
                .compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        //Generate token : User matched
                        //Sign token
                        //Create jst payload
                        const payLoad = { id: user.id, name: user.name, avatar: user.avatar};

                        //Sign : params - payload, secret key from config, expiry, callback
                        jwt.sign(payLoad, keys.secretOrKey, {expiresIn : 3600}, (error, token) => {
                            response.json({
                                success: true,
                                token: 'Bearer ' + token
                            });
                        });
                    }
                    else {
                        errors.password = "Password incorrect!";
                        return response.status(400).json(errors);
                    }
                })
        });
});

// @route   GET api/users/current
// @desc    Return jwt token
// @access  private route
router.get('/current', passport.authenticate('jwt', {session: false}), (request, response) => {
    response.json({user : request .user});
});
module.exports = router;