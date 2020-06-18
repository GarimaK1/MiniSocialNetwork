const express = require('express');
const morgan = require('morgan');
const connectDB = require('./db');
const usersRoute = require('./routes/users');
const postsRoute = require('./routes/posts');
const profileRoute = require('./routes/profile');
const profileExpRoute = require('./routes/profileExperience');
const profileEduRoute = require('./routes/profileEducation');
const authRoute = require('./routes/auth');

const app = express();

// Connect to MongoDB
connectDB();

// Using middleware
app.use(express.json({ extended: false }));

// "morgan" is an HTTP request logger.
if (app.get('env') === 'development') {
    app.use(morgan('dev'));
    // console.log('Morgan enabled.');
}

// Using routes
app.use('/api/users', usersRoute);
app.use('/api/profile', profileRoute);
app.use('/api/profile/experience', profileExpRoute);
app.use('/api/profile/education', profileEduRoute);
app.use('/api/posts', postsRoute);
app.use('/api/auth', authRoute);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));