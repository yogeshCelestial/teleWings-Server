require('dotenv').config();
const jwt = require('jsonwebtoken');
/**
 * 
 * @param {Request} req
 * @param {Response} resp
 * @param {Function} next
 */

const validateToken = async (req, resp, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return resp.status(401).json({ message: 'Token not provided'});
    }
    try {
        const decodedJWT = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedJWT, 'decoded');
        console.log(Date.now());
        if (new Date(decodedJWT.exp) <= Date.now() /1000) {
            return resp.status(401).send({ auth: false, message: 'Token expired.' });
        }
        next();
    } catch (error) {
        return resp.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { validateToken };


