const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql } = require('../db');

router.post('/', async (req, resp) => {
    const logUser = req.body;
    try {
        const users = await sql`SELECT * FROM users WHERE email = ${logUser.email}`;
        const dbUser = users[0];
        const result = await bcrypt.compare(logUser.password, dbUser.password);
        delete dbUser.password;
        if (users.length && result) {
                const token = jwt.sign(dbUser, process.env.JWT_SECRET, {
                    expiresIn: 3600, // one hour expiration time
                });
                return resp.status(200).json({ authToken: token, body: dbUser});
        } else {
            resp.status(401).json({ message: 'UNAUTHORIZED' })
        }
    } catch (err) {
        return resp.status(500).json({ message: 'Internal Server Error' });
    }
   
});

module.exports = router;