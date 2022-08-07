const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const uuid = require('uuid');
const cors = require('cors');
const Event = require("../../models/events");
const jwt = require('jsonwebtoken');
const User = require('../../models/users');
// events

router.use(bodyParser.json())

router.use(function (req, res, next) {

  // This line specifies which custom requests can be included with the request
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
  // This line specifies which response headers are allowed to be exposed to client
  res.header(
      'Access-Control-Expose-Headers',
      'x-access-token, x-refresh-token'
  );

  next();
});
router.use(cors())

const pg = require('knex')({
  client: 'pg',
  connection: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "postgres",
    password: "masterchef",
  }
});

// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
  let token = req.header('x-access-token');
  // verify the JWT
  jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
      if (err) {
          // there was an error
          // jwt is invalid - * DO NOT AUTHENTICATE *
          res.status(401).send(err);
      } else {
          // jwt is valid
          req.user_id = decoded._id;
          next();
      }
  });
}

router.get("/",authenticate,async (req,res)=>{
  const id = req.user_id;
  const user = await User.findOne({_id:id})
  let admin = false;
  if(user){
    if(user.Admin){
      admin = true;
    }
  }
  const events = await Event.find();
  userEvents = []
  upcomingEvents = []
  let pushed = false;
  for(i = 0; i < events.length; i++){
    pushed = false;
    for(j = 0; j < events[i]._userID.length; j++){
      if(events[i]._userID[j] == id){
        userEvents.push(events[i])
        pushed = true;
        break;
      }
    }
    if(pushed === false){
      if(events[i].reminder === true){
        events[i].reminder = false
      }
      upcomingEvents.push(events[i])
    }
  }
  // events.forEach((event) =>{
  //     pushed = true;
  //     event._userID.forEach((_id) =>{
  //       if (_id == id){
  //         userEvents.push(event);
  //         pushed = false

  //       }
  //       else if(pushed && _id != id && upcomingEvents.length < 5){
  //         console.log(pushed)
  //         upcomingEvents.push(event)
  //       }
  //     })
  // })
  res.json({userEvents: userEvents,upcomingEvents: upcomingEvents ,admin: admin});
})

router.delete("/:id",authenticate,async (req,res) =>{
  const event_id = req.params.id;

  // const deleted = await Event.deleteOne({_id: event_id});

  const event = await Event.findOne({_id: event_id});
  event.DeleteUserFromEvent(req.user_id).then((event) => {
    res.json(event)
  })
  //console.log(deleted)

})

router.delete("/admin/:id",authenticate, async(req,res) =>{
  const event_id = req.params.id;
  const event = await Event.findOne({_id: event_id})
  const deleted = await Event.deleteOne({_id: event_id});
  //const user = await User.find()
  let user_emails = []
  for(i = 0; i < event._userID.length; i++){

    const user = await User.findOne({_id: event._userID[i]})
    user_emails.push(user.email)

  }

  pg('event_wiley').insert({event_id: event_id,event_name: event.text,attendence: event._userID.length, users: user_emails })
    .then(() =>{
      res.json(deleted)
    })
})

router.get("/:id",authenticate,async (req,res) =>{
  const event_id = req.params.id;

  const event = await Event.findOne({_id: event_id});
  const Users = await User.find();


  emails = []

  for(i = 0; i < Users.length; i++){
    for(j = 0; j < event._userID.length; j++){
      if(Users[i]._id.toString() == event._userID[j].toString()){
        emails.push(Users[i].email)
        emails.push(" ")

      }
    }
  }
  res.json(emails)

})

router.put("/:id",authenticate,async (req,res) =>{
  const user_id = req.user_id;
  const event = await Event.findById(req.params.id).exec();
  event.reminder = req.body.reminder;
  if(req.body.reminder === true){
    event._userID.push(user_id);
  }
  else{
    event._userID.remove(user_id);
  }
  await event.save();
  res.send(event);
})

router.post("/",authenticate,async (req,res)=> {


  if(!req.body.text || !req.body.day){
    return res.status(400).json("Please add Event and date")
  }

  const newTask = new Event(req.body);

  newTask.save().then(() => {
     newTask.setUser(req.user_id).then((event) => {
      res.json(event);
     })
  })
})

module.exports = router;
