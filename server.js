const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const path = require('path');

connectDB();
const app = express();

app.use('/tasks',require('./routes/api/Tasks'))
app.use('/signin',require('./routes/api/SignIn'))

app.use(express.static(__dirname + '/dist/register'));
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});
  


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{console.log("Server started")});
