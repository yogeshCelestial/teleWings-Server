const router = require('express').Router();
const { sql } = require('../db');

router.get('/', async (req, resp) => {
    const { searchVal } = req.query;
    console.log(searchVal);
    try {
        const users = await sql`SELECT userId, name FROM users WHERE name LIKE ${'%' + searchVal + '%'}`;
        if (users.length) {
            resp.status(200).json(users);
        }
    } catch (err) {
        return resp.status(400).json({ message: 'Bad Request' });
    }
});

module.exports = router;