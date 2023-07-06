const express = require('express');
const router = express.Router();
const Task = require('../models/Tasks');
const Student = require('../models/Students')
const Project = require('../models/Projects')





router.route('/addStudent')
.post(async (req, res) => {
  const { username , password,role, email, tasks,project } = req.body;

      const s = new Student({
         username,password,role,email,tasks,project
      });
      await Task.findByIdAndUpdate(req.body.tasks,{$push:{student:s}})  
      await Project.findByIdAndUpdate(req.body.project,{$push:{team:s}})  
      try {
            
          await s.save();

          
          res.json(s);
        } catch (err) {
          res.status(500).send(err);
        }

   
      
  }
  

)

router.get('/allstudent', async(req, res)=>{
  try{
      
      students = await Student.find( );
      res.status(200).send(students);
      
  } catch(error) {
      res.status(400).send(error)
  }

})
   


router.get('/getbyid/:id', async (req,res)=>{
    try{
        student= await Student.findById(req.params.id)
        res.status(200).json(student);

    }catch (error) {
        res.status(404).json({ message: error.message })
    }
})



router.get('/allteacher', async(req, res)=>{
    try{
        
        students = await Student.find( );
        res.status(200).send(students);
        
    } catch(error) {
        res.status(400).send(error)
    }

})

router.delete('/del/:id', async (req,res)=>{
  try{
    const _id= req.params.id  
    const stud=await Student.findById({_id}) 

    const deletedstudent = await Student.findByIdAndDelete(_id);
    await Task.findByIdAndUpdate(req.body.task,{$pull:{tasks:stud._id}})
    
    if (deletedstudent){
        res.json({
            status:"SUCCESS",
            message:"Comment deleted successfully"
        })
    }
    else {
        res.json({
            status:"FAILED",
            message:"Comment not deleted Successfully"
        })
    }
    
}catch (error) {
    res.status(400).send(error)
}
});





router.put('/updatestudent/:id', async (req,res)=> {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Student.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update student with id=${id}. Maybe Student was not found!`
          });
        } else res.send({ message: "Student was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Student with id=" + id
        });
      });
  });






module.exports = router;


         
      









