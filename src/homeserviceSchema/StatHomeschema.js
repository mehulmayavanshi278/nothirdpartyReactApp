const mongoose = require("mongoose");
const StathomeSchema = new mongoose.Schema({
    serviceId:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    openTime:{
        type:String,
        required:true
    },
    closeTime:{
        type:String,
        required:true
    },
    ratings:{
        type:String,
    },
    area:{
        type:String,
        required:true
    },
    storeName:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    }
})

const stathomes = new mongoose.model("stathomes" , StathomeSchema);
module.exports = stathomes