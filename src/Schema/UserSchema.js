const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
   email:{
    type:String,
    required:true
   },
   password:{
    type:String,
    required:true
   },
   userImg:{
    type:String,
   },
   isServiceProvider:{
    type:Boolean,
    default:false
   },
   mobile:{
    type:String
   },
   whatsApp:{
    type:String
   }
   ,
   age:{
    type:String
   },
   zender:{
    type:String
   },
   likedservices:[],
   mycart:[
    {
        serviceId:{
            type:String,
        },
        serviceType:{
            type:String,
        }

    }
   ],
   tokens:[
    {
        token:{
            type:String,
            required:true
        }
    }
   ],
   addedServices:[
    {
        name:{
         type:String,
        },
        role:{
            type:String,
        },
        img:{
            type:String,
        },
        serviesId:{
            type:String,
        },
        addedDate:{
            type:String,
            default:moment().format('D-MM-YYYY')
        }

    }
   ]
});


userSchema.pre("save",async function(next){
  try{
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        next();
    }
  }catch(err){
    console.log(err);
  }
})

userSchema.methods.generateAuthToken = async function(next){
    try{
        const token = await jwt.sign({id:this._id} , process.env.SECREAT_KEY)
        this.tokens = this.tokens.concat({token});
        await this.save();
        return token
        next();
    }catch(err){
        console.log(err)
    }
  
}

const users = new mongoose.model("users" , userSchema);
module.exports = users;