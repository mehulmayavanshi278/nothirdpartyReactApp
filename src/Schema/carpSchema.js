const mongoose = require("mongoose");

const carpSchema = new mongoose.Schema({
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
        type:String,

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

const carpenters = new mongoose.model("carpenters",carpSchema);
module.exports = carpenters;