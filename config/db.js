const mongoose = require('mongoose');
require("dotenv").config()

const connectDB = async()=>{
  try{
    Uri = process.env.MONGO_URI;
    const conn = await mongoose.connect(Uri);
    console.log(`MongoDB connected: ${conn.connection.host}`)
  }catch(error){
    console.log(error);
    process.exit(1);
  }
}

module.exports = connectDB;
