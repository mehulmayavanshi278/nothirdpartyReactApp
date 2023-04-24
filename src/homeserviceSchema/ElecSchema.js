const mongoose = require("mongoose");
const ElecSchema = new mongoose.Schema({
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

const Elechomes = new mongoose.model("Elechomes" , ElecSchema);
module.exports = Elechomes