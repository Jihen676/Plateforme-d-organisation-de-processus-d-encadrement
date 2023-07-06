const express = require('express');
const router = express.Router();
const Task = require('../models/Tasks')
const multer =require ('multer');
const User = require('../models/Users');
const Project = require('../models/Projects');
const Comment = require('../models/Comments');



const mystorage =multer.diskStorage({
    destination :'./Files',
    filename: (req, file, callback) => {
        const originalname = file.originalname; // Get the original filename
        callback(null, originalname); // Save the file with its original filename
      }
})

// filename:(req,file,redirect)=>{
//     let date = Date.now();
//     let fl = date + '.' +file.mimetype.split('/')[1];
//     redirect(null,fl);
//     filename =fl;
    
// }
const upload = multer({storage:mystorage});


router.post('/createtask',upload.single('image'),  async (req, res) => {
       
    try{            
            const data = req.body ;
            const task = new Task(data) ;
            task.image =req.file.filename ;
            
            const proj =await Project.findById(req.body.project)
            console.log(proj)
            proj.nombretask +=1
            proj.nombretodo +=1; 
            await proj.save()
            const savedTask = await task.save();        
            await User.findByIdAndUpdate(req.body.etudiant1,{$push:{tasks:task}}) 
            await User.findByIdAndUpdate(req.body.etudiant2,{$push:{tasks:task}})
             await Project.findByIdAndUpdate(req.body.project,{$push:{tasks:task}})    
                
            res.status(200).json(savedTask)
        }catch (error){
            res.status(400).json(error.message)
        }      

        });
        // await User.findByIdAndUpdate(req.body.student,{$push:{tasks:task}}) 
  //  await User.findByIdAndUpdate(req.body.etudiant1,{$push:{tasks:task}}) 
            //  await User.findByIdAndUpdate(req.body.etudiant2,{$push:{tasks:task}})  

    router.route('/modifystate/:id')
     .put(async(req,res)=>{
        try{
            
          
            const task=await Task.findById({_id:req.params.id})
            const proj =await Project.findById(task.project)
            if (task.state == "Upcoming"){
                task.state = "InProgress";
                proj.nombreinprogress +=1
                proj.nombretodo -=1; 
                await proj.save()
                await task.save()              
                res.json(task)
            }else if (task.state == "InProgress") {
                task.state = "Done";           
                proj.nombreinprogress -= 1 ;
                proj.nombredone += 1;
                await task.save()
                await proj.save()
                res.json(task)
            }
        }catch(err) {
            res.status(500).send(err.message);
        }
     })
 router.route('/afficherstate/:state')
     .get(async(req,res)=>{
        try{
            const task=await Task.find({state:req.params.state})
                res.json(task)        
        }catch(err) {
            res.status(500).send(err);
        }
     })


 
// This is the route for geting  tasks by user

router.route('/my-tasks/:student' ).get(async (req, res) => {  
        try {

            const tasks = await Task.find({student: req.params.student});
            res.json(tasks)
        } catch (err) {
            res.status(500).send(err);

        }

    })
router.route('/gettaskbyproject/:id_proj' ).get(async (req, res) => {  
        try {
            const tasks = await Task.find({ project: req.params.id_proj }).populate('project').populate("etudiant1").populate("etudiant2")
            res.json(tasks)
        } catch (err) {
            res.status(500).send(err);

        }

    })

    router.get('/gettaskbystateproject/:state/:project', async (req, res) => {
        try {
          const { state, project } = req.params;
          const tasks = await Task.find({ state, project }).populate('project').populate("etudiant1").populate("etudiant2").populate("comment")
          res.json(tasks);
        } catch (err) {
          res.status(500).send(err);
        }
      });
      router.get('/taskbystatestudent/:state/:etudiant1', async (req, res) => {
        try {
            const { state, etudiant1 } = req.params;
          const tasks = await Task.find({ state,  etudiant1 }).populate('project').populate("etudiant1")
          res.json(tasks);
        } catch (err) {
          res.status(500).send(err);
        }
      });
   router.route('/alltasks')
    .get(async (req, res) => {  
        try {
            const tasks = await Task.find().populate("etudiant1").populate("etudiant2");
            res.status(200).json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }

    })
    router.route('/getbyid/:id')
    .get(async (req, res) => {  
        try {
            const onetask = await Task.findById(req.params.id).populate("etudiant1").populate("etudiant2").populate("comment")
            res.status(200).json(onetask);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }

    })

 // This is the route for deleting a task


router.delete('/deletetask/:id', async (req,res)=>{
    try{
        
       
        const deletedtask = await Task.findById({ _id: req.params.id });
          
        await User.findOneAndUpdate({ _id: deletedtask.etudiant1 }, { $set: { etudiant1: null } });
        await User.findOneAndUpdate({ _id: deletedtask.etudiant2 }, { $set: { etudiant2: null } });
        await Comment.findOneAndUpdate({ _id: deletedtask.comment }, { $pull: { task: deletedtask._id } });
            await Task.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: "Task deleted successfully" });            
        }catch (error) {
            res.status(400).json({ error: error.message });
        }
        
   
       
    }
);




// This is the route for updating a task


router.put('/updatetask/:id', upload.single('image'), async (req, res) => {
  try {
 
  const taskId  = req.params.id;
  const updateData = req.body; // Updated data for the task
  if (req.file) {

    updateData.image = req.file.filename;
  }

  const updatedtask = await Task.findByIdAndUpdate( taskId , updateData);

    if (!updatedtask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedtask);
  } catch (error) {
    res.status(400).json(error);
  }
});


    
 
  


    


module.exports = router;