require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const signUpRouter = require('./controllers/signup');
const signInRouter = require('./controllers/signin');
const chatsRouter = require('./controllers/chats');
const usersRouter = require('./controllers/users');

const { Server } = require("socket.io");
const cors = require('cors');
const { validateToken } = require('./middlewares/auth');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

io.on("connection", (socket) => {
    socket.on('login', (userId) => {
        socket.join(userId);
        socket.emit("connected to socket");
        socket.send(userId, 'userId');
    })

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
    })

    socket.on("leftRoom", (roomId) => {
        socket.leave(roomId);
    });

    socket.on("sendMsg", (newMessage, roomId, senderId) => {
        socket
          .to(roomId)
          .emit("receiveMsg", {
            newMessage,
            senderId,
          });
      });
    
});

app.use(
    cors({
        origin: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);

app.use(express.json());
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use('/signUp', signUpRouter);
app.use('/signIn', signInRouter);
app.use('/chats', validateToken, chatsRouter);
app.use('/users', usersRouter);

httpServer.listen(8080, () => {
    console.log('Application is listening on PORT ', 8080)
})
