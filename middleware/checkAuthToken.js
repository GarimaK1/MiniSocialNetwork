const jwt = require('jsonwebtoken');
const config = require('config');

// To check if incoming request from react has token or not to access private routes.
module.exports = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('x-auth-token');

        // If there is no token
        if (!token) {
            return res.status(401).json({ msg: 'Access denied. No token provided.' });
        }

        // Verify token // Takes care of token expiry too
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // Add user property to request. Available to all authenticated routes.
        req.user = decoded.user;
        next();
    } catch (error) {
        console.log('Error occurred in auth middleware. Error: ', error);
        res.status(401).json({ msg: 'Token is not valid' });
    }
}