const router = require('express').Router();
const { sql } = require('../db');
const { validateToken } = require('./../middlewares/auth');

router.get('/', validateToken, async (req, resp) => {
    try {
        const allMsgs = await sql`SELECT * FROM MESSAGES`
        return resp.status(200).json({ allMsg: allMsgs });
    } catch (error) {

    }
})

module.exports = router;