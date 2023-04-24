const mongoose = require("mongoose");
mongoose.connect(process.env.DB).then(()=>{
    console.log("connetcted to Database")
}).catch((err)=>{
    console.log(err);
})
module.exports = mongoose;