const express = require("express")

const userRoute = require('./routes/user');
const projectRoute = require('./routes/project');
const teacherRoute = require('./routes/teacher');
const taskRoute = require('./routes/task');
const commentRoute = require('./routes/comment')
const studentRoute = require('./routes/student')
const managerRoute = require('./routes/manager')
const defenseRoute = require('./routes/Defense')
const depositRoute = require('./routes/Deposit')
const fileRoute = require('./routes/file')


const path = require('path');
const https = require('https');
const fs = require('fs');
require('./config/connect');

const app = express()
app.use(express.json())
const cors = require("cors")
app.use(cors())
const morgan = require('morgan')
app.use(morgan('dev'))
app.use('/getimage',express.static('./Files'))
// //Multer configuration 


//connect to db
const port = process.env.port || 9090;
const mongoose = require("mongoose")
mongoose.set('debug', true);
mongoose.Promise = global.Promise;


// mongoose.connect("mongodb+srv://jihen:QpK7MzoUTweZIctG@pfe.idvh1gi.mongodb.net/PFE?retryWrites=true&w=majority")




app.use('/user', userRoute);
app.use('/student', studentRoute);
app.use('/project', projectRoute);
app.use('/teacher', teacherRoute);
app.use('/task' ,taskRoute);
app.use('/comment', commentRoute);
app.use('/manager', managerRoute);
app.use('/defense', defenseRoute);
app.use('/deposit', depositRoute);
app.use('/file', fileRoute);


//images 
console.log(require('path').join(__dirname,'/Files'))
app.use('/Files', express.static(path.join(__dirname, 'Files')));








app.listen("9090", ()=>{
    console.log("Server works ")
})