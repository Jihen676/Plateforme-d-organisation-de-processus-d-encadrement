const express = require('express');

const router = express.Router();
const Deposit = require('../models/Deposit');



router.get('/getbyid/:id', async (req,res)=>{
    try{
        const deposit = await Deposit.findById(req.params.id)
        res.status(200).json(deposit);

    }catch (error) {
        res.status(404).json({ message: error.message })
    }
})


router.post('/create', async(req, res)=>{
try{            
    const data = req.body ;
    const dep = new Deposit(data) ;
    const savedDep = await dep.save();                     
    res.status(200).json(savedDep)
}catch (error){
    res.status(400).json(error)
}      
})


router.get('/all', async(req, res)=>{
    try{        
        dep = await Deposit.find( );
        res.status(200).send(dep);        
    } catch(error) {
        res.status(400).send(error)
    }

})


router.delete('/delete/:id', async (req,res)=>{
    try{
        const _id= req.params.id   
        const deleteddep = await Deposit.findByIdAndDelete({_id});
        if (deleteddep){
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


router.put('/updatedeposit/:id', async (req,res)=>{
    
    try{
        id= req.params.id;
        newData = req.body;   
        updated = await Deposit.findByIdAndUpdate({_id: id} , newData);
        res.send(updated)
    }catch (error) {
        res.send(error)
    }
});






module.exports = router;