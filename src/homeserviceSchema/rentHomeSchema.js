const mongoose = require("mongoose")
const rentHomeSchema = new mongoose.Schema({
    serviceId:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    Rent:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    postedTime:{
        type:String,
        required:true
    }
})

const rentnsellhomes = new mongoose.model("rentnsellhomes" ,rentHomeSchema );
module.exports = rentnsellhomes;