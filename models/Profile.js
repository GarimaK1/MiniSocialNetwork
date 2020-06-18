// Embedding documents: experience and education inside profile document.
const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date
        // required: function () { return !this.current } 
        // cannot use arrow function here coz of 'this'
        // Not using it because experience is embedded inside profile.
        // Difficult to generate custom error message
        // Logic was: "if currently working at said company, 'current' is true, 'to' field is not required."
    },
    current: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    }
});

const educationSchema = new mongoose.Schema({
    school: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    fieldOfStudy: {
        type: String,
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date
    },
    current: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    }
});

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }, 
    company: {
        type: String
    }, 
    website: {
        type: String
    }, 
    loaction: {
        type: String
    }, 
    status: {
        // instructor, developer, tester, architect, student etc.
        type: String,
        required: true
    }, 
    skills: {
        type: [String],
        required: true
    }, 
    bio: {
        type: String
    }, 
    githubusername: {
        type: String
    }, 
    experience: [experienceSchema],
    education: [educationSchema],
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        },
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports.Experience = mongoose.model('experience', experienceSchema);
module.exports.Education = mongoose.model('education', educationSchema);
module.exports.Profile = mongoose.model('profile', profileSchema);