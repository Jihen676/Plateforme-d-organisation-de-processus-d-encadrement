const express = require('express');

const router = express.Router();
const Project = require('../models/Projects');
const User = require('../models/Users')
const Task =require('../models/Tasks')

router.get('/getbyid/:id', async (req,res)=>{
    try{
       const project = await Project.findById(req.params.id)
        res.status(200).json(project);

    }catch (error) {
        res.status(404).json({ message: error.message })
    }
})




router.post('/createproject', async(req, res)=>{
try{
            
    const data = req.body ;
    const proj = new Project(data) ;

    const savedProj = await proj.save();
         
     await User.findByIdAndUpdate(req.body.etudiant1,{$push:{projet:proj}})  
     await User.findByIdAndUpdate(req.body.etudiant2,{$push:{projet:proj}})    
     await User.findByIdAndUpdate(req.body.encadrant,{$push:{projects:proj}})      
     await Task.findByIdAndUpdate(req.body.task,{$push:{project:proj}})  

    res.status(200).json(savedProj)
}catch (error){
    res.status(400).json(error)
}      
})


router.get('/allproject', async(req, res)=>{
    try{
        
        const projects = await Project.find().populate("etudiant1").populate("etudiant2").populate("encadrant");
       
      
        res.status(200).json(projects);
        
    } catch(error) {
      console.error(error);
      res.status(400).send(error.message);
    }

})
router.get('/validatedproject', async(req, res)=>{
  try{
      
      const projects = await Project.find({statut :"Validé"}).populate("etudiant1").populate("etudiant2").populate("encadrant");
     
    
      res.status(200).json(projects);
      
  } catch(error) {
    console.error(error);
    res.status(400).send(error.message);
  }

})

router.get('/projets/:encadrantId', async (req, res) => {
  try {
    const encadrantId = req.params.encadrantId;

    const projects = await Project.find({ encadrant: encadrantId ,statut :"Validé"}).populate("etudiant1").populate("etudiant2")
      .populate('encadrant');

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});



router.get('/projetsvalid', async(req, res)=>{
  try{
      
      const projects = await Project.find({ statut: 'Validé' })

      res.status(200).send(projects);
      
  } catch(error) {
      res.status(400).send(error)
  }

})

router.get('/projbyuser/:etudiant', async(req, res)=>{
  try {

    const projs = await Project.find( {etudiant2: req.params.etudiant} );
    res.json(projs)
} catch (err) {
    res.status(500).send(err);

}

})
router.route('/getproject' ).get(async (req, res) => {
  try {

      const project = await Project.find().populate("tasks");
      res.status(200).json(project)
  } catch (err) {
      res.status(500).send(err);

  }

})
router.delete('/delproject/:id', async (req,res)=>{
    try{
        const _id= req.params.id   
        const deletedProject = await Project.findByIdAndDelete(_id);
        await User.findByIdAndUpdate(deletedProject.etudiant1,{$pull:{projet:_id}}) 
        await User.findByIdAndUpdate(deletedProject.etudiant2,{$pull:{projet:_id}}) 
        await User.findByIdAndUpdate(deletedProject.encadrant,{$pull:{projects:_id}})  
        await Task.findByIdAndUpdate(deletedProject.tasks,{$pull:{project:_id}}) 


        if (deletedProject){
            res.json({
                status:"SUCCESS",
                message:"Project deleted successfully"
            })
        }
        else {
            res.json({
                status:"FAILED",
                message:"Project not deleted Successfully"
            })
        }
        
    }catch (error) {
        res.status(400).send(error)
    }
});



router.patch("/activatelicenceinfo/:id", async (req, res) => {
  try {
    const projToUpdate = await Project.findById(req.params.id);
    if (!projToUpdate) {
      return res.status(404).send("Project not found");
    }
    projToUpdate.statut = "Validé";

    const lastCode1 = await Project.findOne({diplome:"Licence", speciality: 'INFO', statut: "Validé" }).sort({ code: -1 }).select("code");
    const lastCodeNumber1 = lastCode1 && lastCode1.code ? parseInt(lastCode1.code.slice(1)) : 0;
    
    const newCode1 = `L${lastCodeNumber1 + 1}_INFO`;

    projToUpdate.code = newCode1;

    await projToUpdate.save();
    res.status(200).send("Projet validé");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.patch("/activatelicencetic/:id", async (req, res) => {
  try {
    const projToUpdate = await Project.findById(req.params.id);
    if (!projToUpdate) {
      return res.status(404).send("Project not found");
    }
    projToUpdate.statut = "Validé";

    const lastCode2 = await Project.findOne({diplome:"Licence", speciality: 'TIC', statut: "Validé" }).sort({ code: -1 }).select("code");
    const lastCodeNumber2 = lastCode2 && lastCode2.code ? parseInt(lastCode2.code.slice(1)) : 0;
    
    projToUpdate.code = `L${lastCodeNumber2 + 1}_TIC`;

    await projToUpdate.save();
    res.status(200).send("Projet validé");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.patch("/activatelicencemim/:id", async (req, res) => {
  try {
    const projToUpdate = await Project.findById(req.params.id);
    if (!projToUpdate) {
      return res.status(404).send("Project not found");
    }
    projToUpdate.statut = "Validé";

    const lastCode3 = await Project.findOne({diplome:"Licence", speciality: 'MIM', statut: "Validé" }).sort({ code: -1 }).select("code");
    const lastCodeNumber3 = lastCode3 && lastCode3.code ? parseInt(lastCode3.code.slice(1)) : 0;
    
    const newCode3 = `L${lastCodeNumber3 + 1}_MIM`;

    projToUpdate.code = newCode3;

    await projToUpdate.save();
    res.status(200).send("Projet validé");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.patch("/activatelicencese/:id", async (req, res) => {
  try {
    const projToUpdate = await Project.findById(req.params.id);
    if (!projToUpdate) {
      return res.status(404).send("Project not found");
    }
    projToUpdate.statut = "Validé";

    const lastCode4 = await Project.findOne({diplome:"Licence", speciality: 'SE', statut: "Validé" }).sort({ code: -1 }).select("code");
    const lastCodeNumber4 = lastCode4 && lastCode4.code ? parseInt(lastCode4.code.slice(1)) : 0;
    
    const newCode4 = `L${lastCodeNumber4 + 1}_SE`;

    projToUpdate.code = newCode4;

    await projToUpdate.save();
    res.status(200).send("Projet validé");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.patch("/activatemasterinfo/:id", async (req, res) => {
  try {
    const projToUpdate = await Project.findById(req.params.id);
    if (!projToUpdate) {
      return res.status(404).send("Project not found");
    }
    projToUpdate.statut = "Validé";

    const lastCode5 = await Project.findOne({diplome:"Master", speciality: 'INFO', statut: "Validé" }).sort({ code: -1 }).select("code");
    const lastCodeNumber5 = lastCode5 && lastCode5.code ? parseInt(lastCode5.code.slice(1)) : 0;
    
    const newCode5 = `M${lastCodeNumber5 + 1}_INFO`;

    projToUpdate.code = newCode5;

    await projToUpdate.save();
    res.status(200).send("Projet validé");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.patch("/activatemastertic/:id", async (req, res) => {
  try {
    const projToUpdate = await Project.findById(req.params.id);
    if (!projToUpdate) {
      return res.status(404).send("Project not found");
    }
    projToUpdate.statut = "Validé";

    const lastCode6 = await Project.findOne({diplome:"Master", speciality: 'TIC', statut: "Validé" }).sort({ code: -1 }).select("code");
    const lastCodeNumber6 = lastCode6 && lastCode6.code ? parseInt(lastCode6.code.slice(1)) : 0;
    
    const newCode6 = `M${lastCodeNumber6 + 1}_TIC`;

    projToUpdate.code = newCode6;

    await projToUpdate.save();
    res.status(200).send("Projet validé");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.patch("/activatemasterse/:id", async (req, res) => {
  try {
    const projToUpdate = await Project.findById(req.params.id);
    if (!projToUpdate) {
      return res.status(404).send("Project not found");
    }
    projToUpdate.statut = "Validé";

    const lastCode9 = await Project.findOne({diplome:"Master", speciality: 'SE', statut: "Validé" }).sort({ code: -1 }).select("code");
    const lastCodeNumber9 = lastCode9 && lastCode9.code ? parseInt(lastCode9.code.slice(1)) : 0;
    
    const newCode9 = `M${lastCodeNumber9 + 1}_SE`;

    projToUpdate.code = newCode9;

    await projToUpdate.save();
    res.status(200).send("Projet validé");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.patch("/activateinginfo/:id", async (req, res) => {
  try {
    const projToUpdate = await Project.findById(req.params.id);
    if (!projToUpdate) {
      return res.status(404).send("Project not found");
    }
    projToUpdate.statut = "Validé";

    const lastCode7 = await Project.findOne({diplome:"Ingéniérie", speciality: 'INFO', statut: "Validé" }).sort({ code: -1 }).select("code");
    const lastCodeNumber7 = lastCode7 && lastCode7.code ? parseInt(lastCode7.code.slice(1)) : 0;
    
    projToUpdate.code  = `I${lastCodeNumber7 + 1}_INFO`;

    await projToUpdate.save();
    res.status(200).send("Projet validé");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.patch("/activateingse/:id", async (req, res) => {
  try {
    const projToUpdate = await Project.findById(req.params.id);
    if (!projToUpdate) {
      return res.status(404).send("Project not found");
    }
    projToUpdate.statut = "Validé";

    const lastCode8 = await Project.findOne({diplome:"Ingéniérie", speciality: 'SE', statut: "Validé" }).sort({ code: -1 }).select("code");
    const lastCodeNumber8 = lastCode8 && lastCode8.code ? parseInt(lastCode8.code.slice(1)) : 0;
    
    projToUpdate.code= `I${lastCodeNumber8 + 1}_SE`;

    await projToUpdate.save();
    res.status(200).send("Projet validé");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



// router.patch("/activate/:id", async (req, res) => {
//   try {
//     const projToUpdate = await Project.findById(req.params.id);
//     if (!projToUpdate) {
//       return res.status(404).send("Project not found");
//     }
//     projToUpdate.statut = "Validé";

   

//     // Check if diplome is "Licence" and speciality is "Tic"
//     if (projToUpdate.diplome === "Licence" && projToUpdate.speciality === "TIC") {
//       const lastCode = await Project.findOne({ statut: "Validé" }).sort({ code: -1 }).select("code");
//       const lastCodeNumber = lastCode && lastCode.code ? parseInt(lastCode.code.slice(1)) : 0;
//       projToUpdate.code = `L${lastCodeNumber + 1}_TIC`;
//     }
//     // Check if diplome is "Licence" and speciality is "Mim"
//     else if (projToUpdate.diplome === "Licence" && projToUpdate.speciality === "MIM") {
//       const lastCode = await Project.findOne({ statut: "Validé" }).sort({ code: -1 }).select("code");
//       const lastCodeNumber = lastCode && lastCode.code ? parseInt(lastCode.code.slice(1)) : 0;
//       projToUpdate.code = `L${lastCodeNumber + 1}_MIM`;
//     }
//     // Check if diplome is "Licence" and speciality is "SE"
//     else if (projToUpdate.diplome === "Licence" && projToUpdate.speciality === "SE") {
//       const lastCode = await Project.findOne({ statut: "Validé" }).sort({ code: -1 }).select("code");
//       const lastCodeNumber = lastCode && lastCode.code ? parseInt(lastCode.code.slice(1)) : 0;
//       projToUpdate.code = `L${lastCodeNumber + 1}_SE`;
//     }
//     // Check if diplome is "Master" and speciality is "TIC"
//     else if (projToUpdate.diplome === "Master" && projToUpdate.speciality === "TIC") {
//       const lastCode = await Project.findOne({ statut: "Validé" }).sort({ code: -1 }).select("code");
//       const lastCodeNumber = lastCode && lastCode.code ? parseInt(lastCode.code.slice(1)) : 0;
//       projToUpdate.code = `M${lastCodeNumber + 1}_TIC`;
//     }
//     // Check if diplome is "Master" and speciality is "INFO"
//     else if (projToUpdate.diplome === "Master" && projToUpdate.speciality === "INFO") {
//       const lastCode = await Project.findOne({ statut: "Validé" }).sort({ code: -1 }).select("code");
//       const lastCodeNumber = lastCode && lastCode.code ? parseInt(lastCode.code.slice(1)) : 0;
//       projToUpdate.code = `M${lastCodeNumber + 1}_INFO`;
//     }
//     // Check if diplome is "Ingénierie" and speciality is "SE"
//     else if (projToUpdate.diplome === "Ingéniérie" && projToUpdate.speciality === "SE") {
//       const lastCode = await Project.findOne({ statut: "Validé" }).sort({ code: -1 }).select("code");
//       const lastCodeNumber = lastCode && lastCode.code ? parseInt(lastCode.code.slice(1)) : 0;
//       projToUpdate.code = `I${lastCodeNumber + 1}_SE`;
//     }
//     // Check if diplome is "Ingénierie" and speciality is "INFO"
//     else if (projToUpdate.diplome === "Ingéniérie" && projToUpdate.speciality === "INFO") {
//       const lastCode = await Project.findOne({ statut: "Validé" }).sort({ code: -1 }).select("code");
//       const lastCodeNumber = lastCode && lastCode.code ? parseInt(lastCode.code.slice(1)) : 0;
//       projToUpdate.code = `I${lastCodeNumber + 1}_INFO`;
//     }
//     else {
//       const lastCode = await Project.findOne({ statut: "Validé" }).sort({ code: -1 }).select("code");
//       const lastCodeNumber = lastCode && lastCode.code ? parseInt(lastCode.code.slice(1)) : 0;
//       projToUpdate.code = `L${lastCodeNumber + 1}_INFO`;
//     }

//     await projToUpdate.save();
//     res.status(200).send("Projet validé");
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });











router.put('/updateproject/:id', async (req,res)=> {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Project.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Project with id=${id}. Maybe Project was not found!`
          });
        } else res.send({ message: "Project was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Project with id=" + id
        });
      });
  });
  


  router.get('/projetlicencesinfo', async(req, res)=>{
    try{
        
        const projects = await Project.find({diplome:"Licence", speciality: 'INFO' }).populate("etudiant1").populate("etudiant2").populate("encadrant");
  
        res.status(200).send(projects);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/projetlicencestic', async(req, res)=>{
    try{
        
        const projects = await Project.find({diplome:"Licence", speciality: 'TIC' }).populate("etudiant1").populate("etudiant2").populate("encadrant");
  
        res.status(200).send(projects);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/projetlicencesmim', async(req, res)=>{
    try{
        
        const projects = await Project.find({diplome:"Licence", speciality: 'MIM' }).populate("etudiant1").populate("etudiant2").populate("encadrant");
  
        res.status(200).send(projects);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/projetlicencesse', async(req, res)=>{
    try{
        
        const projects = await Project.find({diplome:"Licence", speciality: 'SE' }).populate("etudiant1").populate("etudiant2").populate("encadrant");
  
        res.status(200).send(projects);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/projetmasterinfo', async(req, res)=>{
    try{
        
        const projects = await Project.find({diplome:"Master", speciality: 'INFO' }).populate("etudiant1").populate("etudiant2").populate("encadrant");
  
        res.status(200).send(projects);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/projetmasterse', async(req, res)=>{
    try{
        
        const projects = await Project.find({diplome:"Master", speciality: 'SE' }).populate("etudiant1").populate("etudiant2").populate("encadrant");
  
        res.status(200).send(projects);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/projetmastertic', async(req, res)=>{
    try{
        
        const projects = await Project.find({diplome:"Master", speciality: 'TIC' }).populate("etudiant1").populate("etudiant2").populate("encadrant");
  
        res.status(200).send(projects);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/projetinginfo', async(req, res)=>{
    try{
        
        const projects = await Project.find({diplome:"Ingéniérie", speciality: 'INFO' }).populate("etudiant1").populate("etudiant2").populate("encadrant");
  
        res.status(200).send(projects);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/projetingse', async(req, res)=>{
    try{
        
        const projects = await Project.find({diplome:"Ingéniérie", speciality: 'SE' }).populate("etudiant1").populate("etudiant2").populate("encadrant");
  
        res.status(200).send(projects);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })


module.exports = router;