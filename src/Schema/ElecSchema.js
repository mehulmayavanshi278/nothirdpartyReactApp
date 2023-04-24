const mongoose = require("mongoose");
const moment = require("moment");

const elecSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    whatsApp:{
        type:String,
        required:true
    },
    timing:{
        type:String,
        
    },
    img:{
     type:String
    },
    area:{
      type:String,
      required:true
    },
    role:{
        type:String,
        required:true
    },
    exp:{
        type:String,
    },
    bio:{
        type:String,
        
    },
    ratings:{
        type:Number,
        default:1
      },
      totalRatings:{
          type:Number,
          default:1
      },
      allRatings:[
        {
             userId:{
                type:String
             },
              user:{
                  type:String,
              },
              img:{
                  type:String,
              },
              rate:{
                  type:Number
              },
              reviews:[]
          
        }
      ]

})

const electritions = new mongoose.model("electrition",elecSchema);
module.exports = electritions;