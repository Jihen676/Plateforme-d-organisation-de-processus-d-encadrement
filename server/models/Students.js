const mongoose = require ("mongoose");

const User = require('../models/Users')

const Studentschema = new mongoose.Schema(
   {
    diploma : {
        type : String,
        enum: ['Bachelor', 'Master', 'Engineering']
 
    },
    speciality : {
        type : String,
    
    },
    projectcode : {
        type : String ,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    // tasks : [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Task'
    // }],
   }
)
const Student = User.discriminator('Student',Studentschema)
module.exports=Student