const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  text: String,
  day: String,
  reminder: Boolean,
  _userID:[{type: ObjectId}]
})


EventSchema.methods.setUser = async function(_id){
  let event = this;
  return new Promise((resolve,reject) =>{

    event._userID.push(_id);

    event.save().then(() =>{
      return resolve(event);
    }).catch((e)=>{
      reject(e)
    })

  })
}

EventSchema.methods.DeleteUserFromEvent = function(User_id){
  let event = this;
  return new Promise((resolve,reject) =>{

    const UserIDs = event._userID.filter((id) => {
      id != User_id
    })
    event._userID = UserIDs;
    event.save().then(() =>{
      return resolve(event);
    }).catch((e)=>{
      reject(e)
    })

  })

}

module.exports = mongoose.model("Event",EventSchema)
