// On deleting profile, delete user too.
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const checkAuth = require('../middleware/checkAuthToken');
const { check, validationResult } = require('express-validator');
const Profile = require('../models/Profile').Profile;
const axios = require('axios');
const config = require('config');

// Route to get all profiles is public here. Security concern? Don't know.

// @route   GET /api/profile/me
// @desc    Get current user's profile using auth token
// @access  Private
router.get('/me', checkAuth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name avatar');

        if (!profile) return res.status(404).json({ msg: 'No profile found!' });

        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// @route   POST /api/profile
// @desc    Create or Update user profile
// @access  Private
router.post('/',
    checkAuth,
    [
        check('status', 'status field is required').notEmpty(),
        check('skills', 'skills filed is required').notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {
                company,
                website,
                location,
                status,
                skills,
                bio,
                githubusername,
                youtube,
                twitter,
                linkedin,
                facebook,
                instagram
            } = req.body;

            // Building profile object
            const profileFields = {};
            profileFields.user = req.user.id;
            if (company) profileFields.company = company;
            if (website) profileFields.website = website;
            if (location) profileFields.location = location;
            if (bio) profileFields.bio = bio;
            if (status) profileFields.status = status;
            if (githubusername) profileFields.githubusername = githubusername;
            if (skills) {
                // to convert comma separated input("skills": "sql, JS,PHP") to array(skills: [ 'sql', 'JS', 'PHP' ])
                profileFields.skills = skills.split(',').map(skill => skill.trim());
            }

            // Need to build empty object before using it, else get undefined error
            profileFields.social = {};
            if (youtube) profileFields.social.youtube = youtube;
            if (twitter) profileFields.social.twitter = twitter;
            if (linkedin) profileFields.social.linkedin = linkedin;
            if (facebook) profileFields.social.facebook = facebook;
            if (instagram) profileFields.social.instagram = instagram;

            // console.log(profileFields);

            let profile = await Profile.findOne({ user: req.user.id });

            if (profile) {
                // If profile exists, update it
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }); // returns updated profile  

                return res.json(profile);
            }

            // Profile doesn't exist. Create a new one.
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    });

// @route   Delete /api/profile
// @desc    Delete profile, user and posts
// @access  Private
router.delete('/', checkAuth, async (req, res) => {
    try {
        // Todo: Remove user's posts

        // Remove Profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // Remove User
        await User.findByIdAndRemove(req.user.id);

        res.json({ msg: 'User, profile deleted.' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// @route   GET /api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', 'name avatar');

        res.send(profiles);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// @route   GET /api/profile/user/:userId
// @desc    Get profile using userId
// @access  Public
router.get('/user/:userId', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.userId }).populate('user', 'name avatar');

        if (!profile) return res.status(404).json({ msg: 'There is no profile for this user.' });

        res.send(profile);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'There is no profile for this user.' });
        }
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// @route   GET /api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get('/github/:username', async (req, res) => {
    try {
        const uri = encodeURI(
            `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
        );
        const headers = {
            // 'user-agent': 'node.js', // https://developer.github.com/v3/#user-agent-required
            Authorization: `token ${config.get('githubToken')}`
        };

        const result = await axios.get(uri, { headers });
        res.json(result.data);
    } catch (error) {
        if (error.response.status === 404) {
            return res.status(404).json({ msg: 'No github user found' });
        }
        else {
            console.log(error.message);
            res.status(500).send('Internal Server Error');
        }
    }
});

module.exports = router;