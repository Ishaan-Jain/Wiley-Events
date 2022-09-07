const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const path = require('path');

connectDB();
const app = express();
const http = require('http').createServer(app);

// const {Server} = require("socket.io")
// const io = new Server(http)

const io = require('socket.io')(http, {
    cors: {
      origins: ['https://wiley-events-4086e0df4568.herokuapp.com/']
    }
  });

app.use(function(req, res, next) {
    req.io = io;
    next();
});

app.use('/tasks',require('./routes/api/Tasks'))
app.use('/signin',require('./routes/api/SignIn'))

app.use(express.static(__dirname + '/dist/my-app'));
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/my-app/index.html'));
});

let users = []

io.on('connection', (socket)=>{
    console.log('a user connected');

    socket.on('room',(room,emailid) =>{
        console.log('joining room' + room);
        socket.join(room);
        io.to(room).emit("message",emailid + ":joined room");
        const user = {
            email: emailid,
            id: socket.id
        }
        users.push(user);
        io.to(room).emit("users",users);
        
    })

    socket.on('message',(Obj)=>{
        io.to(Obj.room).emit("message",Obj.email + ':' + Obj.msg);
    })

    
    socket.on('disconnect',()=>{
        console.log('user disconnected')
        let user = users.find(u => u.id === socket.id)
        users = users.filter(u => u.id !== socket.id);
        io.emit("users",users)
    })
})

const PORT = process.env.PORT || 5000;

http.listen(PORT,"0.0.0.0",()=>{console.log("Server started")});
