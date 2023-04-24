const mongoose = require("mongoose");
const profilePicschema = new mongoose.Schema({
    images:[
        {
            imgProfile :{
                type:String,
            }
        }
    ]
})
const profilePic = new mongoose.model("profilePic" , profilePicschema);

module.exports=profilePic;