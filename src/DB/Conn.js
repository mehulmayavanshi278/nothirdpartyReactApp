const mongoose = require("mongoose");
const Database = process.env.DB;
console.log(Database);
mongoose.connect(Database).then(()=>{
    console.log("connetcted to Database")
}).catch((err)=>{
    console.log(err);
})
module.exports = mongoose;
// ,{ useNewUrlParser: true, useUnifiedTopology: true }