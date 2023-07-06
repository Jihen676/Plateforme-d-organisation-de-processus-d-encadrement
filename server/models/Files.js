const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(

    {

        manager : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'},
        student : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'},

        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
        },

        document: {
            type: String,


        },
    
        date:{
            type: String,
        }
        

    },{timestamps:true});
const File = mongoose.model('File', fileSchema);

module.exports = File; 