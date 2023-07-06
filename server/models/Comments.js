const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(

    {
        text: {
            type: String,
           
        },
        teacher:  {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            
        },
        task:  {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            
        },

    },{timestamps:true})
 const Comment = mongoose.model('Comment', commentSchema);
    
 module.exports = Comment; 