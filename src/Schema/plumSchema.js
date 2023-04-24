const mongoose = require("mongoose");
const moment = require("moment");

const plumSchema = new mongoose.Schema({
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
    age:{
        type:String
    },
    zender:{
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
    img:{
        type:String
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
                type:mongoose.Schema.Types.ObjectId,
                ref:'users'
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

const plumbers = new mongoose.model("plumbers" , plumSchema);
module.exports = plumbers;