const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const Project =require('../models/Projects')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const multer = require('multer');
const {randomBytes} = require('crypto')
const mongoose = require('mongoose');
require('dotenv').config();

// Set up Multer storage configuration

const mystorage =multer.diskStorage({
  destination :'./Files',
  filename: (req, file, callback) => {
    const originalname = file.originalname; // Get the original filename
    callback(null, originalname); // Save the file with its original filename
  }
})
// const { form } = require("../lib/form");
// const { nodeMailer } = require("../lib/nodemailer");
"use strict";
const nodemailer = require("nodemailer");
const fs = require("fs");

const upload = multer({storage:mystorage});



router.post("/inscriremail", upload.single('avatar'), async (req, res) => {
  const { username, email, password, role ,diploma,speciality } = req.body;
  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    return res.status(409).send("User Already Exists. Please Login");
  }

  var hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    username: username,
    email: email,
    password: hashedPassword,
    role: role,
    diploma:diploma,
    speciality:speciality,
    verificationcode:randomBytes(6).toString("hex"),
   
    // projet : new mongoose.Types.ObjectId(projet),
  };
  if (req.file) {
    newUser.avatar = req.file.filename;
  }

  User.create(newUser)  
    .then(async (createdUser) => {
      // const confirmationLink = `https://localhost:3000/signupconfirm/${newUser._id}`; // Replace with your confirmation link
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use TLS
        auth: {
          user: "websiteapp83@gmail.com",
          pass: "vufornupspyoasmj",
        },
      });
      
        const message = {
          from: '"Encadra plateforme " websiteapp83@gmail.com', // sender address
          to: createdUser.email, // list of receivers
          subject: "Bienvenue à Encadra", // Subject line
          html:  `
          <!doctype html>
      <html lang="en-US">
      <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>Email Confirmation</title>
          <style type="text/css">
              a:hover {text-decoration: underline !important;}
          </style>
      </head>
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <!-- 100% body table -->
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap'); font-family: 'Montserrat', sans-serif;">
              <tr>
                  <td>
                      <table style="background-color: #f2f3f8; max-width: 600px; margin: 0 auto;" width="100%" border="0"
                          align="center" cellpadding="0" cellspacing="0">
                          <tr>
                              <td>
                                  <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0"
                                      style="max-width: 600px; background: #ffffff; border-radius: 5px; text-align: center; box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);">
                                      <tr>
                                          <td style="padding: 40px 30px;">
                                              <h1 style="color: #1e1e2d; font-weight: 500; margin: 0; font-size: 32px;">Email Confirmation</h1>
                                              <hr style="border: none; border-bottom: 1px solid #cecece; margin: 29px 0 26px; width: 100px;">
                                              <p style="color: #455056; font-size: 16px; line-height: 24px; margin: 0;">
                                              Merci de vous être inscrit chez nous ! Pour terminer votre inscription, veuillez cliquer sur le bouton ci-dessous pour confirmer votre adresse e-mail.
                                              </p>
                                              <a href="http://127.0.0.1:3000/signupconfirm/${createdUser.verificationcode}"style="background: #1D267D; text-decoration: none !important; font-weight: 500; color: #fff; text-transform: uppercase; font-size: 14px; padding: 12px 30px; display: inline-block; border-radius: 30px; margin-top: 30px; text-decoration: none;">
                                                  Confirmer Email</a>
 
                                             
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
          <!-- /100% body table -->
      </body>
      </html>`
          
        };
      
        // send mail with defined transport object
         transporter.sendMail(message, (err, info) => {
          
          if (err) {
            console.log(err);
          } else {
            console.log("mail sent:" + info.response);
          }
        })
        await Project.findByIdAndUpdate(req.body.projet,{$push:{etudiant1:createdUser._id}})  
        await Project.findByIdAndUpdate(req.body.projet,{$push:{etudiant2:createdUser._id}})  
      res.status(200).json({
        message: "User Added Successfully!",
        user: createdUser
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
})
//   

router.get("/VERIFY-NOW/:verificationcode", async (req, res) => {
    const {verificationcode} =req.params
    const isUser = await User.findOne({verificationcode});
    console.log("user",isUser)
    try {
          if (isUser) {
            isUser.confirmed =true
            isUser.verificationcode = undefined
            isUser.save()   
            return res.status(200).json({ message: "L'e-mail de l'utilisateur est vérifié avec succès" });
            
          }
          else {
            return res.status(400).json({ message: "L'e-mail est déjà confirmé" });
    }
  }
    catch (error) {
      return res.status(400).json({ "message": error.message });
    }
  }
  )


router.get("/", async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "Admin" } }); 
    res.json(users); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
})

  
  // Login Function
  
  
  router.post("/login", async (req, res) => {
  
    // Validate if user exist in our database
  
    const users = await User.findOne({ email: req.body.email })
    
  
    //Token creation
    const token = jwt.sign({ users }, 'privateKey', { expiresIn: '10h' })
  
  
    if (!users) return res.status(404).send({ message: " Email invalide!" })
    let id = users._id
   
  
    const validPass = await bcrypt.compare(req.body.password, users.password)
    if (!validPass) return res.status(400).send({ message: "Mot de passe invalide" })
  
    const UserStatus = users.activated
    const role = users.role
  
    if (UserStatus == "OFF") {
  
      return res.status(201).send({ message: "L'administrateur n'a pas encore activé votre compte ", token, UserStatus, id });
  
    } else if (UserStatus == "ON") {
      return res.status(200).send({ message: "Bienvenue",users, token, UserStatus, id,role })
  
    }
    
  })
  

  router.route('/getInterns').get(async (req, res) => {
    try {
      const interns = await User.find({ role: 'Etudiant', activated: 'ON' }).populate('projet');
      res.status(200).json(interns);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })


  router.route('/getstudents').get(async (req, res) => {
    try {
      const interns = await User.find({ role: 'Etudiant' });
      res.status(200).json(interns);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })

  //----------------- Licence--------------------- 
  router.route('/getLicenceInfoStudent').get(async (req, res) => {
    try {
      const interns = await User.find({ role: 'Etudiant',diploma:"Licence",speciality:"INFO", activated: 'ON' })
      res.status(200).json(interns);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })

  router.route('/getLicenceTicStudent').get(async (req, res) => {
    try {
      const interns = await User.find({ role: 'Etudiant',diploma:"Licence",speciality:"TIC", activated: 'ON' })
      res.status(200).json(interns);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  router.route('/getLicenceMimStudent').get(async (req, res) => {
    try {
      const interns = await User.find({ role: 'Etudiant',diploma:"Licence",speciality:"MIM", activated: 'ON' })
      res.status(200).json(interns);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  router.route('/getLicenceSeStudent').get(async (req, res) => {
    try {
      const interns = await User.find({ role: 'Etudiant',diploma:"Licence",speciality:"SE", activated: 'ON' })
      res.status(200).json(interns);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  //------------------Master---------------


  router.route('/getMasterSeStudent').get(async (req, res) => {
    try {
      const interns = await User.find({ role: 'Etudiant',diploma:"Master",speciality:"SE", activated: 'ON' })
      res.status(200).json(interns);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  router.route('/getMasterTicStudent').get(async (req, res) => {
    try {
      const interns = await User.find({ role: 'Etudiant',diploma:"Master",speciality:"TIC", activated: 'ON' })
      res.status(200).json(interns);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })

  router.route('/getMasterInfoStudent').get(async (req, res) => {
    try {
      const interns = await User.find({ role: 'Etudiant',diploma:"Master",speciality:"INFO", activated: 'ON' })
      res.status(200).json(interns);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })

  //---------------Ingenierie-------------

  router.route('/getIngInfoStudent').get(async (req, res) => {
    try {
      const interns = await User.find({ role: 'Etudiant', diploma:"Ingéniérie",speciality:"INFO", activated: 'ON' })
      res.status(200).json(interns);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  router.route('/getIngSeStudent').get(async (req, res) => {
    try {
      const interns = await User.find({ role: 'Etudiant', diploma:"Ingéniérie",speciality:"SE", activated: 'ON' })
      res.status(200).json(interns);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  router.route('/getLicenceInterns').get(async (req, res) => {
    try {
      const interns = await User.find({ role: 'Etudiant', activated: 'ON' }).populate('projet');
      res.status(200).json(interns);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })


  
  
  
  router.patch("/activate/:id", async (req, res) => {
  
    try {
      const userToUpdate = await User.findById(req.params.id);
      if (!userToUpdate) {
        return res.status(404).send("User not found");
      }
      userToUpdate.activated = "ON";
      await userToUpdate.save();
      res.status(200).send("User activated successfully");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  
  
  })
  
  // Activate Function 
  
  
  router.patch("/block/:id", async (req, res) => {
  
    try {
      const userToUpdate = await User.findById(req.params.id);
      if (!userToUpdate) {
        return res.status(404).send("User not found");
      }
      userToUpdate.activated = "OFF";
      await userToUpdate.save();
      res.status(200).send("User blocked");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  
  
  })
  
  // Delete User
  
  router.delete("/delete/:id", async (req, res) => {
  
    try {
     
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  
  
  
  })

  router.route('/getbyid/:id')
  .get(async (req, res) => {  
      try {
          const oneuser = await User.findById(req.params.id).populate("comments");
          res.status(200).json(oneuser);
      } catch (err) {
          res.status(500).json({ message: err.message });
      }

  })

  router.route('/getSupervisors')
  .get(async (req, res) => {
    try {
      const supervisors = await User.find({ role: 'Encadrant', activated: 'ON' });
      res.status(200).json(supervisors);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  router.route('/getteachers')
  .get(async (req, res) => {
    try {
      const supervisors = await User.find({ role: 'Encadrant' });
      res.status(200).json(supervisors);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })

  router.route('/getManagers')
  .get(async (req, res) => {
    try {
      const managers = await User.find({ role: 'Gestionnaire', activated: 'ON' });
      res.status(200).json(managers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  router.route('/getGestionnaire')
  .get(async (req, res) => {
    try {
      const managers = await User.find({ role: 'Gestionnaire' });
      res.status(200).json(managers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })


// ---------------------PROFIL-------------------------
router.get('/profile/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});


router.put('/updateprofile/:id',upload.single('avatar'), async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    if (req.file) {
      updatedData.avatar = req.file.filename;
    }
  
    const user = await User.findByIdAndUpdate(id, updatedData);

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    res.status(200).json({
      user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});

router.put('/updatepicture/:id', upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.params.id;
    const avatar = req.file.filename;

    const user = await User.findByIdAndUpdate(userId, { avatar });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


router.get('/getprofile/:id/avatar', async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    if (!user.avatar) {
      return res.status(404).json({ status: 404, message: "Avatar not found" });
    }

    // Set the Content-Type header based on the image file extension
    res.set('Content-Type', 'image/jpeg');

    // Send the avatar image data
    res.send(user.avatar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});




//-----------------------RESET & FORGOT PASSWORD ------------------


router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret =  process.env.JWT_SECRET + oldUser.password;
    const token = jwt.sign({id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:3000/resetpass/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "websiteapp83@gmail.com",
        pass: "vufornupspyoasmj",
      },
    });

    var mailOptions = {
      from: "websiteapp83@gmail.com",
      to: oldUser.email,
      subject: "Réinitialiser Mot de passe",
      text: `
      <!doctype html>
      <html lang="en-US">
      <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>Reset Password Email Template</title>
          <meta name="description" content="Reset Password Email ">
          <style type="text/css">
              a:hover {text-decoration: underline !important;}
          </style>
      </head>
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <!--100% body table-->
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
              <tr>
                  <td>
                      <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                          align="center" cellpadding="0" cellspacing="0">
                          
                          <tr>
                              <td>
                                  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                      style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                      <tr>
                                          <td style="padding:0 35px;">
                                          <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Vous avez demandé la réinitialisation de votre mot de passe</h1>
                                              <span
                                                  style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                  <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                  Un lien unique pour réinitialiser votre mot de passe a été généré pour vous. Pour réinitialiser votre mot de passe, cliquez sur le lien suivant et suivez les instructions.
                                                  </p>
                                              <a href=${link}
                                                  style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Rénitialiser
                                                  mot de passe </a>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                         
                      </table>
                  </td>
              </tr>
          </table>
          <!--/100% body table-->
      </body>
      </html>`,
      html: `
<!doctype html>
<html lang="en-US">
<head>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
<title>Reset Password Email Template</title>
<meta name="description" content="Reset Password Email ">
<style type="text/css">
    a:hover {text-decoration: underline !important;}
</style>
</head>
<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
<!--100% body table-->
<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
    style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
    <tr>
        <td>
            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                align="center" cellpadding="0" cellspacing="0">
               
                <tr>
                    <td>
                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                            style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                            <tr>
                                <td style="height:40px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="padding:0 35px;">
                                    <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Vous avez demandé la réinitialisation de votre mot de passe</h1>
                                    <span
                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                    Un lien unique pour réinitialiser votre mot de passe a été généré pour vous. Pour réinitialiser votre mot de passe, cliquez sur le lien suivant et suivez les instructions.
                                    </p>
                                    <a href="${link}"
                                        style="background:#1D267D;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Réinitialiser mot de passe
                                      </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:40px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
               
            </table>
        </td>
    </tr>
</table>
<!--/100% body table-->
</body>
</html>`,
                
    };


    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(400).json({ message: "Error" });
      } else {
        oldUser.tokenuser=token
        oldUser.save()
        return res.status(200).json({ message: "Email Sent" });
    }});
  } catch (error) {return res.status(400).json({ message: error.message }); }

})

  





router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const oldUser = await User.findOne({ tokenuser: token });
    if (!oldUser) {
      return res.json({ status: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(req.body.newpassword, 10);
   
    oldUser.tokenuser = undefined;
    await oldUser.save();

    return res.send("Password reset successful");
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.route('/addphoto').post(upload.single('avatar'), (req, res) => {

  const avatar = req.file.filename;
  const newUserData = { 
      avatar }

  const newUser = new User(newUserData);

  newUser.save()
         .then(() => res.json('User Added'))
         .catch(err => res.status(400).json('Error: ' + err));
});

router.put('/uploadprofil', upload.single('avatar'), (req, res) => {
 
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Handle the uploaded file, e.g., save it to a database or process it further
  // ...

  res.status(200).send('File uploaded successfully.');
});



module.exports = router;