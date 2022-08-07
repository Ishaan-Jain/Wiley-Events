const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lodash = require('lodash');
const jwt = require('jsonwebtoken');

const jwtSecret = "68282y2uewewhd*whbdw29bdjdbd3728328382u329ue2ejc@1#4";

const crypto = require('crypto');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  email:{
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  sessions: [{
    token:{
      type: String,
      required: true
    },
    expiresAt: {
      type: Number,
      required: true
    }
  }],
  Admin: Boolean
})

// Instance Methods

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  // return the document except the password and sessions (these shouldn't be made available)
  return lodash.omit(userObject, ['password', 'sessions']);
}


// create json web token and return that
UserSchema.methods.generateAccessAuthToken = function(){
  const user = this;
  return new Promise((resolve, reject) => {
      // Create the JSON Web Token and return that
      jwt.sign({ _id: user._id.toHexString() }, jwtSecret, { expiresIn: "5m" }, (err, token) => {
          if (!err) {
              resolve(token);
          } else {
              // there is an error
              reject();
          }
      })
  })

}

// This method generates a 64bit hex string it does not save it to the database
UserSchema.methods.generateRefreshAuthToken = function(){

    return new Promise((resolve, reject) => {
      crypto.randomBytes(64, (err, buf) => {
          if (!err) {
              // no error
              let token = buf.toString('hex');
              return resolve(token);
          }else{
            return reject();
          }
      })
  })
}

UserSchema.methods.createSession = function(){
  let user = this;
  return user.generateRefreshAuthToken().then((refreshToken) =>{
    return saveSessiontoDatabase(user,refreshToken);
  }).then((refreshToken) => {
    return refreshToken;
  }).catch((e) => {
    Promise.reject("Failed to save session to database\n" + e);
  })

}


//Model methods(static methods) can be called by model itself not just an instance of a model

UserSchema.statics.getJWTSecret = () => {
  return jwtSecret;
}

UserSchema.statics.findByIdAndToken = function (_id, token) {
  // finds user by id and token
  // used in auth middleware (verifySession)

  const User = this;

  return User.findOne({
      _id,
      'sessions.token': token
  });
}

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;
  return User.findOne({ email }).then((user) => {
      if (!user) return Promise.reject();

      return new Promise((resolve, reject) => {
          bcrypt.compare(password, user.password, (err, res) => {
              if (res) {
                  resolve(user);
              }
              else {
                  reject();
              }
          })
      })
  })
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
  let secondsSinceEpoch = Date.now() / 1000;
  if (expiresAt > secondsSinceEpoch) {
      // hasn't expired
      return false;
  } else {
      // has expired
      return true;
  }
}

// Middleware
// Before a user document is saved, this code runs
UserSchema.pre('save', function (next) {
  let user = this;
  let costFactor = 10;


  if (user.isModified('password')) {
      // if the password field has been edited/changed then run this code.

      // Generate salt and hash password
      bcrypt.genSalt(costFactor, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
              user.password = hash;
              next();
          })
      })
  } else {
      next();
  }
});


// Helper methods
let saveSessiontoDatabase =  (user,refreshToken) =>{
  return new Promise((resolve,reject) =>{
    let expiresAt = generateTokenExpiryTime();

    user.sessions.push({'token': refreshToken, expiresAt});

    user.save().then(() =>{
      return resolve(refreshToken);
    }).catch((e)=>{
      reject(e)
    })

  })

}

let generateTokenExpiryTime = () => {
  let daysUntilExpire = '1';
  let secondsUntilExpire = ((daysUntilExpire * 24) * 60 ) * 60;
  return ((Date.now() /1000)) + secondsUntilExpire;

}

module.exports = mongoose.model("User",UserSchema)
