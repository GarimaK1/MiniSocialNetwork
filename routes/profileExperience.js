const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuthToken');
const { check, validationResult } = require('express-validator');

const Experience = require('../models/Profile').Experience;
const Profile = require('../models/Profile').Profile;

// @route   PUT /api/profile/experience
// @desc    Add Experience to Profile
// @access  Private
router.put('/',
    checkAuth,
    [
        check('title', 'Title field is required').notEmpty(),
        check('company', 'Company field is required').notEmpty(),
        check('from', 'From field is required').notEmpty(),
        check('from', 'From field is not valid').isBefore()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {
                title,
                company,
                location,
                from,
                to,
                current,
                description
            } = req.body;

            const newExp = new Experience({
                title,
                company,
                location,
                from,
                to,
                current,
                description
            });

            const profile = await Profile.findOne({ user: req.user.id });

            if (!profile) return res.status(404).json({ msg: 'There is no profile for this user.' });

            profile.experience.unshift(newExp);
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

// @route   Delete /api/profile/experience/:expId
// @desc    Delete experience from profile by experience_id
// @access  Private
router.delete('/:expId', checkAuth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) return res.status(404).json({ msg: 'There is no profile for this user.' });

        // https://mongoosejs.com/docs/subdocs.html#finding-a-subdocument
        const exp = profile.experience.id(req.params.expId);

        if (!exp) return res.status(404).json({ msg: 'Experience entry does not exist.' });
        exp.remove();
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;