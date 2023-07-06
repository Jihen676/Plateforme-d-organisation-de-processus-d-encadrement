const mongoose = require('mongoose');


const Defense = mongoose.model('Defense',{
    hour : {
        type: String,
       
    },
    manager : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'},
    protractor :  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'},
    etudiant1 : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'},
    etudiant2 : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'},

    president :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'},
    supervisor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'},
  
    project : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'},
    reference :{
        type :String,
        
    },
   
    date:{
        type : String,
    
    },
    classe:{
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
})

module.exports = Defense;





   
    
 