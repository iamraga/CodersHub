const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
//Load validation
const validateProfileInputs = require('../../validation/profile');
const validateExperienceInputs = require('../../validation/experience');
const validateEducationInputs = require('../../validation/education');

//Load Profile model
const Profile = require('../../models/Profile');
//Load User model
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Test profile route
// @access  public route
router.get('/test', (request, response) => response.json({msg: "Profile works!"}));

// @route   GET api/profile
// @desc    User profile route
// @access  protected
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    
    const errors = {};
    Profile.findOne({ user : req.user.id }) //User ID is referenced in the Profile model
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = "No profile found for this user!"; 
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch( err => res.status(400).json(err));
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name','avatar'])
        .then(profiles => {
            if(!profiles) {
                errors.noprofile = "There are no profiles!"; 
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(error => res.status(400).json({profiles: "There are no profiles!"}));
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  public
router.get('/handle/:handle', (request, response) => {
    const errors = {};
    Profile.findOne({handle: request.params.handle})
        .populate('user', ['name','avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'No profile found for this user!';
                response.status(404).json(errors);
            }
            response.status(200).json(profile);
        })
        .catch(error => res.status(400).json(error));
});

// @route   GET api/profile/user/:userid
// @desc    Get  profile by id
// @access  public
router.get('/user/:userid', (request, response) => {
    const errors = {};
    Profile.findOne({user: request.params.userid})
        .populate('user', ['name','avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'No profile found for this user!';
                response.status(404).json(errors);
            }
            response.status(200).json(profile);
        })
        .catch(error => response.status(400).json({profile: "No profile available!"}));
});

// @route   POST api/profile
// @desc    Create or Edit User profile route
// @access  protected
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateProfileInputs(req.body);
    
    //Check validation
    if(!isValid) {
        //Return errors
        return res.status(400).json(errors);
    }

    //Get all fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    //Skills - split as array - This is comma separated array.
    if(typeof req.body.skills !== 'undefined') {
        profileFields.skills = (req.body.skills).split(",");
    }

    //Social 
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    
    Profile.findOne({user: req.user.id})
        .then(profile => {
            if(profile) {
                //Check if handle exists
                Profile.findOne({ handle : profileFields.handle })
                    .then(handleProfile => {
                        if(handleProfile && handleProfile._id !== req.user.id) {
                            errors.handle = "That handle already exists";
                            res.status(400).json(errors);
                        }
                        //Already available, So update
                        Profile.findOneAndUpdate(
                            { user: req.user.id }, 
                            { $set : profileFields }, 
                            { new: true }
                        )
                        .then(profile => res.json(profile));
                    })
                    .catch(error => res.status(400).json({profile : "No user available!"}))
            }
            else {
                //Check if handle exists
                Profile.findOne({ handle : profileFields.handle })
                    .then(profile => {
                        if(profile) {
                            errors.handle = "That handle already exists";
                            res.status(400).json(errors);
                        }
                        
                        //Save Profile
                        new Profile(profileFields).save().then(profile => res.json(profile));
                    });
            }
        })
        .catch (error => res.status(400).json({profile : "No user available!"}));
});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateExperienceInputs(req.body);
    
    //Check validation
    if(!isValid) {
        //Return errors
        return res.status(400).json(errors);
    }
    
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExperience = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            //Add to exp array
            profile.experience.unshift(newExperience); //Unshift to append it to top. 

            profile.save().then(profile => res.json(profile));
        })
        .catch(error => res.json(errors));
});

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  private
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateEducationInputs(req.body);
    
    //Check validation
    if(!isValid) {
        //Return errors
        return res.status(400).json(errors);
    }
    
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEducation = {
                school: req.body.school,
                degree: req.body.degree,
                fieldOfStudy: req.body.fieldOfStudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            //Add to exp array
            profile.education.unshift(newEducation); //Unshift to append it to top. 

            profile.save().then(profile => res.json(profile));
        })
        .catch(error => res.json(errors));
});

// @route   DELETE api/profile/experience/:expid
// @desc    delete experience from profile
// @access  private
router.delete('/experience/:expid', passport.authenticate('jwt', {session: false}), (req, res) => {
    
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const removeIndex = profile.experience.map(item => item.id)
            .indexOf(req.params.expid);

            //Splice out of array
            profile.experience.splice(removeIndex, 1);

            //Save
            profile.save().then(profile => res.json(profile));
        })
        .catch(error => res.status(404).json(errors));
});

// @route   DELETE api/profile/education/:eduid
// @desc    delete education from profile
// @access  private
router.delete('/education/:eduid', passport.authenticate('jwt', {session: false}), (req, res) => {
    
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const removeIndex = profile.education.map(item => item.id)
            .indexOf(req.params.eduid);

            //Splice out of array
            profile.education.splice(removeIndex, 1);

            //Save
            profile.save().then(profile => res.json(profile));
        })
        .catch(error => res.status(404).json(errors));
});

// @route   DELETE api/profile
// @desc    delete profile
// @access  private
router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    //Delete profile and delete user too.
    Profile.findOneAndDelete({user: req.user.id})
        .then(() => {
            User.findOneAndRemove({_id: req.user.id}).then(() => {
                res.json({msg: "User successfully deleted"});
            });
        });
});

module.exports = router;