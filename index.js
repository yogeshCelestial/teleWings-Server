require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const signUpRouter = require('./controllers/signup');
const signInRouter = require('./controllers/signin');
const messageRouter = require('./controllers/message');

const app = express();
app.use(express.json());
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use('/signUp', signUpRouter);
app.use('/signIn', signInRouter);
app.use('/message', messageRouter);

app.listen(8080, () => {
    console.log('Application is listening on PORT ', 8080)
})
