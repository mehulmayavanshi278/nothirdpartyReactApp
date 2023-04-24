const mongoose = require("mongoose");
const imgSchema = new mongoose.Schema({
    flatImg:[],
    medImg:[],
    gymImg:[],
})

const img = new mongoose.model("img" ,imgSchema );
module.exports = img