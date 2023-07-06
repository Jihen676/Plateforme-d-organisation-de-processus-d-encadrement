const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(

    {

        etudiant1 : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'},
        etudiant2 : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'},

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
        },

        state: {
            type: String,
            enum: ['Upcoming', 'InProgress', 'Done',],
            default :'Upcoming'

        },
        comment: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        image: {
            type: String,
        },
        
        project : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        },
        date:{
            type: String,
        }

    });
const Task = mongoose.model('task', taskSchema);

module.exports = Task; 