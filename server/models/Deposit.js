const mongoose = require('mongoose');

const Deposit = mongoose.model('Deposit',{
    sector : {
        type: String,
       
    },
    depositdate : {
        type : String,
       
    },
    defensedate: {
        type:String,
        
    },
    reportnumber :{
        type :String,
      
    },
   
    
})

module.exports = Deposit;