
const express = require('express');
const Comment =require('../models/Comments');
const Task =require('../models/Tasks')
const Teacher = require ('../models/Teachers');
const User = require('../models/Users');


const router = express.Router();
router.route('/addComment')
    .post(async (req, res) => {
        const { text ,task ,teacher} = req.body;

        const C = new Comment({
            text,
            task ,teacher
        });
        await Task.findByIdAndUpdate(req.body.task,{$push:{comment:C}})    
        await User.findByIdAndUpdate(req.body.teacher,{$push:{comments:C}})    
        await C.save()

            .then(() => {
                res.json(C);

            }).catch((err) => {
                res.status(500).send(err);


            });
        
       

    });

    router.route('/mycomment/:task')
    .get(async (req, res) => {  
        try {

            const comments = await Comment.find({ task: req.params.task }).populate("teacher");
            res.json(comments)
        } catch (err) {
            res.status(500).send(err);

        }

    })



    router.put('/updatecomment/:id', async (req,res)=>{
        try{
            const _id= req.params.id  
            // const comment =await Comment.findById({_id}) 
            // await Task.findByIdAndUpdate(comment.task,{$pull:{comments:comment._id}})
            // await Teacher.findByIdAndUpdate(comment.teacher,{$pull:{comments:comment._id}})
            const updatedcomment = await Comment.findByIdAndUpdate({_id});
            if (updatedcomment){
                res.json({
                    status:"SUCCESS",
                    message:"comment updated successfully"
                })
                res.json (updatedcomment)        
            }
            else {
                res.json({
                    status:"FAILED",
                    message:"Comment not updated Successfully"
                })
            }
            
        }catch (error) {
            res.status(400).send(error)
        }
    });
    router.put('/updatecom/:id', async (req,res)=> {
        if (!req.body) {
          return res.status(400).send({
            message: "Data to update can not be empty!"
          });
        }
      
        const id = req.params.id;
      
        const com =Comment.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
          .then(data => {
            if (!data) {
              res.status(404).send({
                message: `Cannot update Comment with id=${id}. Maybe Comment was not found!`
              });
            } else res.send({ message: "Comment was updated successfully." });
          })
          .catch(err => {
            res.status(500).send({
              message: "Error updating Comment with id=" + id
            });
          });
      });
    




      router.route('/getbyid/:id')
      .get(async (req, res) => {  
          try {
              const com = await Comment.findById(req.params.id).populate("teacher")
              res.status(200).json(com);
          } catch (err) {
              res.status(500).json({ message: err.message });
          }
  
      })



      router.delete('/deletecomment/:id', async (req, res) => {
        try {
          const _id = req.params.id;
      
          const comment = await Comment.findById(_id);
          if (!comment) {
            return res.json({
              status: "FAILED",
              message: "Comment not found"
            });
          }
      
          await Task.findByIdAndUpdate(comment.task, { $pull: { comments: _id } });
          await User.findByIdAndUpdate(comment.teacher, { $pull: { comments: _id } });
      
          const deletedComment = await Comment.findByIdAndDelete(_id);
      
          if (deletedComment) {
            res.json({
              status: "SUCCESS",
              message: "Comment deleted successfully"
            });
          } else {
            res.json({
              status: "FAILED",
              message: "Comment not deleted successfully"
            });
          }
        } catch (error) {
          res.status(400).send(error);
        }
      });
      


    module.exports = router;