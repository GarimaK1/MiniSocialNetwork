const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuthToken');
const { check, validationResult } = require('express-validator');

const Education = require('../models/Profile').Education;
const Profile = require('../models/Profile').Profile;

// @route   PUT /api/profile/education
// @desc    Add Education to Profile
// @access  Private
router.put('/',
    checkAuth,
    [
        check('school', 'School field is required').notEmpty(),
        check('degree', 'Degree field is required').notEmpty(),
        check('fieldOfStudy', 'FieldOfStudy field is required').notEmpty(),
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
                school,
                degree,
                fieldOfStudy,
                from,
                to,
                current,
                description
            } = req.body;

            const newEdu = new Education({
                school,
                degree,
                fieldOfStudy,
                from,
                to,
                current,
                description
            });

            const profile = await Profile.findOne({ user: req.user.id });

            if (!profile) return res.status(404).json({ msg: 'There is no profile for this user.' });

            profile.education.unshift(newEdu);
            await profile.save();

            res.json(profile);
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

// @route   Delete /api/profile/education/:eduId
// @desc    Delete education from profile by education_id
// @access  Private
router.delete('/:eduId', checkAuth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) return res.status(404).json({ msg: 'There is no profile for this user.' });

        // https://mongoosejs.com/docs/subdocs.html#finding-a-subdocument
        const edu = profile.education.id(req.params.eduId);

        if (!edu) return res.status(404).json({ msg: 'Education entry does not exist.' });
        edu.remove();
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;