const mongoose = require("mongoose");
const PlumSchema = new mongoose.Schema({
    serviceId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    exp:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    ratings:{
      type:String,
    }
})

const plumHomes = new mongoose.model("plumHomes" , PlumSchema);
module.exports = plumHomes