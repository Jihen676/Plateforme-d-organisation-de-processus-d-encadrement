const mongoose = require ("mongoose");

const User = require('../models/Users')

const Managerschema = new mongoose.Schema(
   {
    position: {
        type : String,
 
    },
   
  
   }
)
const Manager = User.discriminator('Manager',Managerschema)
module.exports=Manager