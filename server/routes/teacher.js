const express = require('express');

const router = express.Router();
const Teacher = require('../models/Teachers');
// const express = require('express');
// const Task = require('../models/Tasks');
 const Comment =require('../models/Comments');
 const User = require('../models/Users');

router.route('/addTeacher')
    .post(async (req, res) => {
        const { poste, password,role, email, username ,comments  } = req.body;
      
            const C = new Teacher({
                poste,password,role,email,username,comments
            });
             
            try {
                await Comment.findByIdAndUpdate(req.body.comment,{$push:{teacher:C}})    
                await C.save();

                
                res.json(C);
              } catch (err) {
                res.status(500).send(err);
              }
    
         
            
        }
        
  
      )


// const multer = require ('multer');
// const mystorage = multer.diskStorage({
//     destination: './Uploads',
//     filename: (req, file , redirect)=>{
//         let date = Date.now();
//         let fl = date + '.' + file.mimetype.split('/')[1];
//         redirect(null,fl);
//         filename = fl;
//     }
// })
// const upload = multer({storage: mystorage});
// router.post('/createproject', upload.any('State') ,async(req, res)=>{
//     try{
//         data = req.body;
//         proj = new Project(data);
//         proj.State = filename ;
//         savedProject = await proj.save();
//         filename = '';
//         res.status(200).send(savedProject)
//     } catch(error) {
//         res.status(400).send(error)
//     }

// })
router.get('/getbyid/:id', async (req,res)=>{
    try{
        teacher = await Teacher.findById(req.params.id)
        res.status(200).json(teacher);

    }catch (error) {
        res.status(404).json({ message: error.message })
    }
})




router.get('/allteacher', async(req, res)=>{
    try{
        
        teachers = await Teacher.find( );
        res.status(200).send(teachers);
        
    } catch(error) {
        res.status(400).send(error)
    }

})

router.delete('/del/:id', async (req,res)=>{
    try{
        const _id= req.params.id   
        
        await Comment.findByIdAndUpdate(Comment.teacher,{$pull:{teacher:_id}})
        const deletedTeacher = await Teacher.findByIdAndDelete({_id});
        if (deletedTeacher){
            res.json({
                status:"SUCCESS",
                message:"Teacher deleted successfully"
            })
        }
        else {
            res.json({
                status:"FAILED",
                message:"Teacher not deleted Successfully"
            })
        }
        
    }catch (error) {
        res.status(400).send(error)
    }
});





router.put('/updateteacher/:id', async (req,res)=> {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Teacher.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update teacher with id=${id}. Maybe Tutorial was not found!`
          });
        } else res.send({ message: "Teacher was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Teacherwith id=" + id
        });
      });
  });




module.exports = router;