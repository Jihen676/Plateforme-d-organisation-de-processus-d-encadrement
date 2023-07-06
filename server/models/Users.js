const mongoose =require("mongoose")

const UserSchema =new mongoose.Schema ({
    username: {
        type: String,       
    },
    firstname: {
        type: String,       
    }, 
    lastname: {
        type: String,
      
    },
    email : {
        type : String,

    },
    password : {
        type : String,
               
    },
    role: {
        type: String,
        enum: ['Admin','Gestionnaire', 'Encadrant', 'Etudiant'],
        
       
    },
    activated: {
        type: String,
        enum: ['ON', 'OFF'],
        default: 'OFF'
    },
    number : {
        type: Number,
    },
   

    avatar: {
        type: String,
    },
   
    tasks : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    comments:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    resetPass: {
        type: Boolean,
        default: false,
      },
    documents:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }],
    document:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }],
    projet:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    projects:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    presentations:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Defense'
    }],
    presentation:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Defense'
    },
    soutenances: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Defense'
    }],
    
    verificationcode:{
        type: String,
    },
    codeExpires: Date,
    confirmed:{
        type :Boolean,
        default :false
    },
    

    diploma : {
        type : String,
        enum: ['Licence', 'Master', 'Ingéniérie']
 
    },
    speciality : {
        type : String,
        enum: ['INFO', 'TIC', 'MIM','SE']
    
    },
    tokenuser:{
        type: String,
    },
    position:{
        type:String,
    }

    
},{timestamps:true})

const User=mongoose.model("User",UserSchema)
module.exports = User; 