const express = require('express');

const router = express.Router();
const Manager = require('../models/Manager');

 const User = require('../models/Users');

router.route('/addManager')
    .post(async (req, res) => {
        const { poste, password,role, email, username ,documents  } = req.body;
      
            const manag = new Manager({
                poste,password,role,email,username,documents
            });            
            try {
                await Document.findByIdAndUpdate(req.body.documents,{$push:{manager:manag}})    
                await manag.save();               
                res.json(manag);
              } catch (err) {
                res.status(500).send(err);
              }           
        }        
    )


router.get('/getbyid/:id', async (req,res)=>{
    try{
        manager = await Manager.findById(req.params.id)
        res.status(200).json(manager);

    }catch (error) {
        res.status(404).json({ message: error.message })
    }
})




router.get('/allmanager', async(req, res)=>{
    try{
        
        managers = await Manager.find( );
        res.status(200).send(managers);
        
    } catch(error) {
        res.status(400).send(error)
    }

})

// router.delete('/del/:id', async (req,res)=>{
//     try{
//         const _id= req.params.id   
        
//         await Comment.findByIdAndUpdate(Comment.teacher,{$pull:{teacher:_id}})
//         const deletedTeacher = await Teacher.findByIdAndDelete({_id});
//         if (deletedTeacher){
//             res.json({
//                 status:"SUCCESS",
//                 message:"Teacher deleted successfully"
//             })
//         }
//         else {
//             res.json({
//                 status:"FAILED",
//                 message:"Teacher not deleted Successfully"
//             })
//         }
        
//     }catch (error) {
//         res.status(400).send(error)
//     }
// });





// router.put('/updateteacher/:id', async (req,res)=> {
//     if (!req.body) {
//       return res.status(400).send({
//         message: "Data to update can not be empty!"
//       });
//     }
  
//     const id = req.params.id;
  
//     Teacher.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
//       .then(data => {
//         if (!data) {
//           res.status(404).send({
//             message: `Cannot update teacher with id=${id}. Maybe Tutorial was not found!`
//           });
//         } else res.send({ message: "Teacher was updated successfully." });
//       })
//       .catch(err => {
//         res.status(500).send({
//           message: "Error updating Teacherwith id=" + id
//         });
//       });
//   });



//   router.route('/delete-student/:id').delete((req, res, next) => {
//     studentSchema.findByIdAndRemove(req.params.id, (error, data) => {
//       if (error) {
//         return next(error);
//       } else {
//         res.status(200).json({
//           msg: data
//         })
//       }
//     })
//   })
module.exports = router;