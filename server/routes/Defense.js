const express = require('express');

const router = express.Router();
const Defense = require('../models/Defense');
const User = require('../models/Users')


router.get('/getbyid/:id', async (req,res)=>{
    try{
        const defense = await Defense.findById(req.params.id)
        res.status(200).json(defense);

    }catch (error) {
        res.status(404).json({ message: error.message })
    }
})


router.post('/createdefense', async(req, res)=>{
try{            
    const data = req.body ;
    const def = new Defense(data) ;
    const savedDef = await def.save(); 
    await User.findByIdAndUpdate(req.body.etudiant1,{$push:{presentation:def}})  
    await User.findByIdAndUpdate(req.body.etudiant2,{$push:{presentation:def}})    
    await User.findByIdAndUpdate(req.body.supervisor,{$push:{presentations:def}}) 
    await User.findByIdAndUpdate(req.body.president,{$push:{presentations:def}})
    await User.findByIdAndUpdate(req.body.protractor,{$push:{presentations:def}})
    await User.findByIdAndUpdate(req.body.manager,{$push:{presentations:def}})     
                        
    res.status(200).json(savedDef)
}catch (error){
    res.status(400).json(error)
}      
})


router.get('/all', async(req, res)=>{
    try{        
        const defense = await Defense.find().populate("etudiant1").populate("etudiant2").populate("project").populate("supervisor").populate("protractor").populate("president");
    
        res.status(200).send(defense);        
    } catch(error) {
        res.status(400).send(error)
    }

})
// router.get('/defenseby/:user', async (req, res) => {
//     try {
//         const { user.username } = req.params;

//         const defense = await Defense.find({
//             $or: [
//                 { president: username },
//                 { protractor: username },
//                 { supervisor: username }
//             ]
//         })
//         .populate("etudiant1")
//         .populate("etudiant2")
//         .populate("project")
//         .populate("supervisor")
//         .populate("protractor")
//         .populate("president");

//         res.status(200).send(defense);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });
router.get('/defensebydiplome/:diplome/:speciality', async (req, res) => {
    try {
        const { diplome,speciality } = req.params;
      const tasks = await Defense.find({ diplome,  speciality }).populate("etudiant1").populate("etudiant2").populate("project").populate("supervisor").populate("protractor").populate("president");
    
      res.json(tasks);
    } catch (err) {
      res.status(500).send(err);
    }
  });

router.delete('/delete/:id', async (req,res)=>{
    try{
        const _id= req.params.id   
        const deleteddef = await Defense.findByIdAndDelete({_id});
        await User.findByIdAndUpdate(deleteddef.etudiant1,{$pull:{presentation:_id}})  
        await User.findByIdAndUpdate(deleteddef.etudiant2,{$pull:{presentation:_id}})    
        await User.findByIdAndUpdate(deleteddef.supervisor,{$pull:{presentations:_id}}) 
        await User.findByIdAndUpdate(deleteddef.president,{$pull:{presentations:_id}})
        await User.findByIdAndUpdate(deleteddef.protractor,{$pull:{presentations:_id}})
        await User.findByIdAndUpdate(deleteddef.manager,{$pull:{presentations:_id}})
        if (deleteddef){
            res.json({
                status:"SUCCESS",
                message:"deleted successfully"
            })
        }
        else {
            res.json({
                status:"FAILED",
                message:" not deleted Successfully"
            })
        }
        
    }catch (error) {
        res.status(400).send(error)
    }
});


router.put('/update/:id', async (req,res)=>{
    
    try{
        id= req.params.id;
        newData = req.body;   
        updated = await Defense.findByIdAndUpdate({_id: id} , newData);

        res.send(updated)
    }catch (error) {
        res.send(error)
    }
});

router.get('/defenselicencesinfo', async(req, res)=>{
    try{
        
        const defenses = await Defense.find({diplome:"Licence", speciality: 'INFO' }).populate("project").populate("supervisor").populate("protractor").populate("president");
  
        res.status(200).send(defenses);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/defenselicencestic', async(req, res)=>{
    try{
        
        const defenses = await Defense.find({diplome:"Licence", speciality: 'TIC' }).populate("project").populate("supervisor").populate("protractor").populate("president");
  
        res.status(200).send(defenses);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/defenselicencesmim', async(req, res)=>{
    try{
        
        const defenses = await Defense.find({diplome:"Licence", speciality: 'MIM' }).populate("project").populate("supervisor").populate("protractor").populate("president");
  
        res.status(200).send(defenses);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/defenselicencesse', async(req, res)=>{
    try{
        
        const defenses = await Defense.find({diplome:"Licence", speciality: 'SE' }).populate("project").populate("supervisor").populate("protractor").populate("president");
  
        res.status(200).send(defenses);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/defensemasterinfo', async(req, res)=>{
    try{
        
        const defenses = await Defense.find({diplome:"Master", speciality: 'INFO' }).populate("project").populate("supervisor").populate("protractor").populate("president");
  
        res.status(200).send(defenses);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/defensemasterse', async(req, res)=>{
    try{
        
        const defenses = await Defense.find({diplome:"Master", speciality: 'SE' }).populate("project").populate("supervisor").populate("protractor").populate("president");
  
        res.status(200).send(defenses);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/defensemastertic', async(req, res)=>{
    try{
        
        const defenses = await Defense.find({diplome:"Master", speciality: 'TIC' }).populate("project").populate("supervisor").populate("protractor").populate("president");
  
        res.status(200).send(defenses);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/defenseinginfo', async(req, res)=>{
    try{
        
        const defenses = await Defense.find({diplome:"Ingéniérie", speciality: 'INFO' }).populate("project").populate("supervisor").populate("protractor").populate("president");
  
        res.status(200).send(defenses);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })
  router.get('/defenseingse', async(req, res)=>{
    try{
        
        const defenses = await Defense.find({diplome:"Ingéniérie", speciality: 'SE' }).populate("project").populate("supervisor").populate("protractor").populate("president");
  
        res.status(200).send(defenses);
        
    } catch(error) {
        res.status(400).send(error)
    }
  
  })




module.exports = router;