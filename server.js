const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');

connectDB();
const app = express();

app.use('/tasks',require('./routes/api/Tasks'))
app.use('/signin',require('./routes/api/SignIn'))


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{console.log("Server started")});
