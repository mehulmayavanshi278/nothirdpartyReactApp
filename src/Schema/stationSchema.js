const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true
    },
    whatsApp:{
        type:String,
        required:true
    },
    zender:{
      type:String
    },
    area:{
        type:String,
        required:true
    },
    openTime:{
        type:String,
        required:true,
    },
    closeTime:{
        type:String,
        required:true
    },
    openDays:{
        type:String,
        required:true
    },
    Images:[
        {
            img:{
                type:String,

            }
        }
    ],
    storeName:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    location:{
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

const stationaries = new mongoose.model("stationaries",stationSchema);
module.exports = stationaries;