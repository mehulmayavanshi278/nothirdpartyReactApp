const express = require("express");
const app = express();
const router = require("./src/Routes/router");
const moment = require("moment");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
require("./src/DB/Conn");
require("dotenv").config();

// console.log(__dirname);

app.use(express.static(path.join(__dirname,"/images")));
console.log(path.join(__dirname,"/images"));
app.use(cors({
  origin:"http://localhost:3000"
}));
app.use(bodyParser.json())
app.use( bodyParser.urlencoded({extended: true }));
app.use(router);

const PORT = process.env.PORT || 5000


// console.log(moment().format('D-MM-YYYY'));

const start = async ()=>{
    try{
      app.listen(PORT,()=>{
        console.log("App is running on port no 5000");
      })
    }catch(err){
        console.log(err);
    }
}


start();
