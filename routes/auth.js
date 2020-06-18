const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const checkAuth = require('../middleware/checkAuthToken');

// @route   GET /api/auth
// @desc    Authenticated/loggded-in/registered user can get info about himself
// @access  Private
router.get('/', checkAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) return res.status(404).json({ errors: [{ msg: 'User does not exist!' }] });
        
        res.json(user);
    } catch (error) {
        console.log('Error occurred on Login', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// @route   POST /api/auth
// @desc    Login/Authenticate user, get token
// @access  Public
router.post('/',
    [
        check('email', "Please enter valid email").isEmail(),
        check('password', "Password is required").exists()
    ],
    async (req, res) => {
        try {
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;


            // See if user already exists in DB. We don't want duplicates.
            let user = await User.findOne({ email });

            if (!user) return res.status(400).json({ errors: [{ msg: 'Invalid credentials!' }] });

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) return res.status(400).json({ errors: [{ msg: 'Invalid credentials!' }] });

            // Return token so user gets authenticated/logged in
            const payload = {
                user: {
                    id: user.id // https://mongoosejs.com/docs/guide.html#id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 }, // seconds
                (err, token) => {
                    if (err) throw err;
                    res.status(201).json({ token });
                }
            );
        } catch (error) {
            console.log('Error in registering user. Error: ', error.message);
            res.status(500).send('Internal Server Error');
            // using mongoose-unique-validator:
            // res.status(500).json({ errors: [{ msg: error.errors.email.properties.message }] });
        }
    });

module.exports = router;