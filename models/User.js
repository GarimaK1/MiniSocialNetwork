const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true 
        // unique and uniqueCaseInsensitive is used here to support validation via 'mongoose-unique-validator'
        // https://mongoosejs.com/docs/validation.html#the-unique-option-is-not-a-validator
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// added plugin to mongoose.
// will check uniqueness before saving to DB. Will throw appropriate error.
// Adding custom message
userSchema.plugin(uniqueValidator, { message: 'Email already exists!'});

module.exports = mongoose.model('user', userSchema);