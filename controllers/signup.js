const router = require('express').Router();
const bcrypt = require('bcrypt');
const { sql } = require('../db');

router.post('/', async (req, resp) => {
    console.log(req.body.name, req.body.email, req.body.password);
    try {
        // Select users with the provided email
        const users = await sql`SELECT * FROM users WHERE email = ${req.body.email}`;
        
        // Check if user with the provided email already exists
        if (users.length) {
            return resp.status(409).json({ message: 'User already exists with this email' });
        } else {
            // Hash the password before inserting
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            // Insert new user into the database
            const createUser = await sql`INSERT INTO users (name, email, password)
                                          VALUES (${req.body.name}, ${req.body.email}, ${hashedPassword})`;
            console.log(createUser);
            
            // Return success message if user is successfully created
            return resp.status(201).json({ message: 'User created successfully' });
        }
    } catch (error) {
        // Log the error for debugging
        console.error('Error creating user:', error);
        
        // Send internal server error response
        return resp.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
