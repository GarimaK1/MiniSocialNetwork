const mongoose = require('mongoose');
const config = require('config');
const dbLink = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(dbLink, 
            { useNewUrlParser: true, 
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false 
            });
        console.log('MongoDB connected to server');
    } catch (error) {
        console.log('Error connecting to DB! Exiting process. Error: ', error);
        process.exit(1); // exit node on failure
    }
}

module.exports = connectDB;