const express = require('express');
const File = require('../models/Files');
const Managers =require('../models/Manager')
const Students = require('../models/Students');
const router = express.Router();
const multer =require ('multer');
const User = require('../models/Users');

const mystorage =multer.diskStorage({
    destination :'./Files',
    filename: (req, file, callback) => {
      const originalname = file.originalname; // Get the original filename
      callback(null, originalname); // Save the file with its original filename
    }
})
const upload = multer({storage:mystorage});

router.post('/createfile',upload.single('document'),  async (req, res) => {
       
    try{
            
            const data = req.body ;
            const doc= new File(data) ;
            doc.document =req.file.filename ;
          
            const savedDoc = await doc.save();

             await User.findByIdAndUpdate(req.body.manager,{$push:{documents:doc}})  
           
                    
            res.status(200).json(savedDoc)
        }catch (error){
            res.status(400).json(error)
        }      

        });
        router.post('/createfilestudent',upload.single('document'),  async (req, res) => {
       
          try{
                  
                  const data = req.body ;
                  const doc= new File(data) ;
                  doc.document =req.file.originalname ;
                  const savedDoc = await doc.save();
      
              
                 await User.findByIdAndUpdate(req.body.student,{$push:{document:doc}})   
                          
                  res.status(200).json(savedDoc)
              }catch (error){
                  res.status(400).json(error)
              }      
      
              });


  router.get('/allfiles', async(req, res)=>{
            try{
                
                docs = await File.find( );
                const filesByStudent = await File.find({ student: { $exists: true } });
                
            } catch(error) {
                res.status(400).send(error)
            }
        
        })
        router.get('/managerfiles', async(req, res)=>{
          try{
              
              docs = await File.find( );
              const files = await File.find({ manager: { $exists: true } });
              res.status(200).json(files);
          } catch(error) {
              res.status(400).send(error)
          }
      
      })

          

      router.delete('/deletefile/:id', async (req, res) => {
        try {
          const docId = req.params.id;
          const deletedDoc = await File.findByIdAndRemove(docId);
      
          if (!deletedDoc) {
            return res.status(404).json({ message: 'Document not found' });
          }
      
          await User.findByIdAndUpdate(deletedDoc.manager, {
            $pull: { documents: docId },
          });
          
          await User.findOneAndUpdate(deletedDoc.student, {
            $pull: { document: docId },
          });
      
          res.status(200).json({ message: 'Document deleted successfully' });
        } catch (error) {
          res.status(400).json(error);
        }
      });
  
      

          router.get('/student-files/:student', async (req, res) => {
            try {
              
            const student = req.params.student;
              const files = await File.find({ student: student }).populate('student');
              res.status(200).json(files);
            } catch (error) {
              res.status(400).json(error);
            }
          });
          router.get('/manager-files', async (req, res) => {
            try {
              const files = await File.find({ manager: { $exists: true } }).populate('manager');
              res.status(200).json(files);
            } catch (error) {
              res.status(400).json(error);
            }
          });
          router.get('/fichierstud', async (req, res) => {
            try {
              const files = await File.find({ student: { $exists: true } }).populate('student');
              res.status(200).json(files);
            } catch (error) {
              res.status(400).json(error);
            }
          });
          router.put('/updatefile/:id', upload.single('document'), async (req, res) => {
            try {
              const docId = req.params.id;
              const updatedData = req.body;
              if (req.file) {
                updatedData.document = req.file.filename;
              }
              const updatedDoc = await File.findByIdAndUpdate(docId, updatedData);
          
              if (!updatedDoc) {
                return res.status(404).json({ message: 'Document not found' });
              }
          
              res.status(200).json(updatedDoc);
            } catch (error) {
              res.status(400).json(error);
            }
          });
          
          router.get('/getfile/:id', async (req, res) => {
            try {
              const docId = req.params.id;
              const doc = await File.findById(docId);
          
              if (!doc) {
                return res.status(404).json({ message: 'Document not found' });
              }
          
              res.status(200).json(doc);
            } catch (error) {
              res.status(400).json(error);
            }
          });
module.exports = router;