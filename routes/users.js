const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../models/User'); // mongoose model

// @route   POST /api/users
// @desc    Register user, get token
// @access  Public
router.post('/',
    [
        check('name', 'Name is required').notEmpty(),
        check('name', 'Name should have min 2 characters').isLength({ min: 2 }),
        check('email', "Please enter a valid email").isEmail(),
        check('password', "Please enter a password with min 3 and max 10 characters")
            .isLength({ min: 3, })
            .isLength({ max: 10 })
    ],
    async (req, res) => {
        try {
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, email, password } = req.body;


            // See if user already exists in DB. We don't want duplicates.
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists!' }] });
            }
            // Get user gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg', // PG-13
                d: 'mm'
            })
            // Create new mongoose document 'user'
            user = new User({
                name,
                email,
                avatar
            });
            // Encrypt password
            const salt = await bcrypt.genSalt(10);

            // update password to hashed password in user document
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            // Return token so user gets authenticated/logged in too
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