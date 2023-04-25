const express = require("express");
require("dotenv").config();
const app = express();
const router = require("./src/Routes/router");
const moment = require("moment");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
require("./src/DB/Conn");


// console.log(__dirname);
console.log(process.env.DB);
app.use(express.static(path.join(__dirname,"/images")));
console.log(path.join(__dirname,"/images"));
app.use(cors({
  // origin:"http://localhost:3000"
   origin:"https://no-third-party.web.app"
}));
app.use(bodyParser.json())
app.use( bodyParser.urlencoded({extended: true }));
app.use(router);

const PORT = process.env.PORT || 5000


// console.log(moment().format('D-MM-YYYY'));

const start = async ()=>{
    try{
      app.listen(PORT,()=>{
        console.log(`app is running on ${PORT}`);
      })
    }catch(err){
        console.log(err);
    }
}


start();
