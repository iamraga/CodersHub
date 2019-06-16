const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//Validation
const validatePostInputs = require('../../validation/post');

// @route   GET api/posts/test
// @desc    Test post route
// @access  public route
router.get('/test', (request, response) => response.json({msg: "Posts work!"}));

// @route   GET api/posts
// @desc    Get Posts
// @access  Public
router.get('/', (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(error => res.status(404).json({noPostFound : "No Post found!"}));
});

// @route   GET api/posts/:id
// @desc    Get POST by ID
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(error => res.status(404).json({noPostFound : "No Post found!"}));
});

// @route   DELETE api/posts/:id
// @desc    Delete POST by ID
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
    .then(profile => {
        Post.findById(req.params.id)
            .then(post => {
                //Check post owner
                if(post.user.toString() !== req.user.id) {
                    return res.status(401).json({notAuthorized: "User not authorized"});
                }

                post.remove()
                    .then(() => {
                        res.json({success: "true"});
                    });
            })
            .catch(error => res.status(404).json({noPostFound : "No Post found!"}));
    })
    .catch(error => res.status(404).json({noUserFound : "User Profile not found!"}));;
});

// @route   POST api/posts
// @desc    Create POST
// @access  private route
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    const {errors, isValid} = validatePostInputs(req.body);
    //Check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
});

// @route   POST api/posts/like/:id
// @desc    Like POST by ID
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
    .then(profile => {
        Post.findById(req.params.id)
            .then(post => {
                if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                    return res.status(400).json({AlreadyLiked: "User already liked this post!"});
                }

                //Add user ID to likes array.
                post.likes.unshift({user : req.user.id});
                post.save().then(post => res.json(post));
            })
            .catch(error => res.status(404).json({noPostFound : "No Post found!"}));
    })
    .catch(error => res.status(404).json({noUserFound : "User Profile not found!"}));;
});

// @route   POST api/posts/unlike/:id
// @desc    Unlike POST by ID
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
    .then(profile => {
        Post.findById(req.params.id)
            .then(post => {
                if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                    return res.status(400).json({NotLiked: "You have not yet liked this post!"});
                }

                //Get remove index
                const removeIndex = post.likes
                    .map(item => item.user.toString())
                    .indexOf(req.user.id);

                //Splice it out of the array
                post.likes.splice(removeIndex, 1);
                post.save().then(post => res.json(post));
            })
            .catch(error => res.status(404).json({noPostFound : "No Post found!"}));
    })
    .catch(error => res.status(404).json({noUserFound : "User Profile not found!"}));
});

// @route   POST api/posts/comment/:id
// @desc    add comment to POST by ID
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    
    //Validation of new post is enough for add comment too. So reusing. 
    const {errors, isValid} = validatePostInputs(req.body);
    //Check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            };

            //Add to comments array
            post.comments.unshift(newComment);
            post.save().then(post => res.json(post));
        })
        .catch(error => res.status(404).json({postNotFound: "No post found!"}));
});

// @route   DELETE api/posts/comment/:id/:commentid
// @desc    remove comment from POST by ID
// @access  Private
router.delete('/comment/:id/:commentid', passport.authenticate('jwt', {session: false}), (req, res) => {

    Post.findById(req.params.id)
        .then(post => {
            if(post.comments.filter(comment => comment._id.toString() === req.params.commentid).length === 0) {
                return res.status(404).json({commentNotFound: "Comment not found!"});
            }

            if(post.comments.filter(comment => (comment.user.toString() === req.user.id && comment._id.toString() === req.params.commentid)).length === 0) {
                return res.status(401).json({userCannotDelete: "Comment cannot be deleted by this user"});
            }

            //Find comment remove index
            const removeIndex = post.comments
                .map(comment => comment._id.toString())
                .indexOf(req.params.commentid);

            post.comments.splice(removeIndex, 1);
            post.save().then(post => res.json(post));
        })
        .catch(error => res.status(404).json({postNotFound: "No post found!"}));
});

module.exports = router;