const router = require('express').Router();
const { sql } = require('../db');

router.get('/', async (req, resp) => {
    const { senderId } = req.query;
    console.log(senderId);
    try {
        const chats = await sql`SELECT * FROM chats WHERE "senderId" = ${senderId} OR "receiverId" = ${senderId}`;
        if (chats.length) {
            resp.status(200).json(chats);
        }
    } catch (err) {
        return resp.status(400).json({ message: 'Bad Request' });
    }
});

module.exports = router;