const mongoose = require ("mongoose");

const User = require('../models/Users')

const Teacherschema = new mongoose.Schema(
{   position: {
    type: String,
   

},

projects:  [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
}],
}
)
const teacher = User.discriminator('Teacher',Teacherschema)
module.exports = teacher