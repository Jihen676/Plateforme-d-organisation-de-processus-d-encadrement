const mongoose =require("mongoose")

const ProjectSchema =new mongoose.Schema ({

    name : {
        type: String,
       
    },

   
    etudiant1:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    etudiant2:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      
    }],
    code : {
        type : String,
    },
    progress : {
        type: String,
        enum: ["Pas commencé", "En progression", "Terminé"],
        default:"Pas commencé"
    
    },
    date : {
        type : String,
        
    },
    diplome :{
        type :String,
        enum :["Licence","Master","Ingéniérie"]
    },
    speciality:{
        type : String,
        enum :["TIC","INFO","SE","MIM"]
    
    },
    tasks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    encadrant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    statut :{
        type :String ,
        enum :["Validé","Non validé"],
        default:"Non validé"
    },
    organisme :{
        type :String ,
    },
    nombretask :{
        type :Number,
        default : 0,
    },
    nombretodo : {
        type: Number,
        default: 0,
    },
    nombreinprogress : {
        type: Number,
        default: 0,
    },
    nombredone : {
        type: Number,
        default: 0,
    }


},{timestamps:true})

const Project=mongoose.model("Project",ProjectSchema )
module.exports =Project; 
    