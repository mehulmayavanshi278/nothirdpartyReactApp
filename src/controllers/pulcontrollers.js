const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const rentHouse = require("../Schema/RentSchema")
const plumbers = require("../Schema/plumSchema")
const electritions = require("../Schema/ElecSchema")
const stationaries = require("../Schema/stationSchema");
const gyms = require("../Schema/gymSchema");
const medicines = require("../Schema/medicineSchema");
const carpenters = require("../Schema/carpSchema");
const users = require("../Schema/UserSchema");


const saveservice = async(req,res)=>{

    const {serviceid , serviceheader } = req.body;
    console.log(serviceid , serviceheader);
    try{
      const token = req.headers.authtoken;
 
      const verifyUser = await jwt.verify(token,process.env.SECREAT_KEY);
      if(verifyUser){
        try{
       let loginUser = await users.findOne({_id:verifyUser.id});
       if(loginUser){
         console.log(loginUser);
         loginUser.mycart = loginUser.mycart.concat({serviceId:serviceid , serviceType:serviceheader});
         loginUser.likedservices = loginUser.likedservices.concat(serviceid);
         await loginUser.save();
         console.log(loginUser);
         return res.send({status:200 , message:"one item saved to cart" , data:loginUser});
       }else{
        return res.status(400).send("login user not found");
       }
        }catch(err){
          console.log(err);
        }
      }else{
        return res.status(400).send("invalid authtoken");
      }
    }catch(err){
      if(err.name==="JsonWebTokenError"){
        return res.status(201).send({message:"notlogin"});
      }else{
        console.log(err);
      }
    }

      

  
   }

 
  const addratings=async(req,res)=>{
    try{
       let param = req.params['serviceid'];
       let rate = req.body.ratings;
       console.log(param);
       console.log(rate);
       let serviceid = req.params['serviceid'].split(":")[0];
       let servicetype = req.params['serviceid'].split(":")[1];
       const token = req.headers.authtoken;
       if(token){
        console.log("yess");
        return 
       }else{

       }
       const verifyUser = await jwt.verify(token,process.env.SECREAT_KEY);
       if(verifyUser){
        let loginUser = await users.findOne({_id:verifyUser.id});
        console.log(loginUser._id.toString());

        // console.log(userid);
        let servicetypeArray = ["rentnsell" ,"plumbers", "electritions" , "stationaries" , "gyms" , "medicines" , "carpenters"];
        let servicesArray = [rentHouse , plumbers , electritions , stationaries , gyms ,  medicines , carpenters];
        let indexofservice = servicetypeArray.indexOf(servicetype);

        let isexistreviewer = await servicesArray[indexofservice].findOne({_id:serviceid , allRatings : {$elemMatch:{userId:loginUser._id}}});
        const newrating = {
          userId:loginUser._id,
          user:loginUser.name,
          img:loginUser.userImg,
          rate:rate,
        } 
        console.log(isexistreviewer);
        let addrating 
        if(isexistreviewer){ 
          console.log("i am out")
         addrating = await servicesArray[indexofservice].findOneAndUpdate({_id:serviceid , "allRatings.userId":loginUser._id} , {$set:{"allRatings.$.user":loginUser.name , "allRatings.$.rate":rate}})  // this type of query is used  when we want update something in object of an array field
           
        }else{
          console.log("i am in")
          addrating = await servicesArray[indexofservice].updateOne({_id:serviceid} , {$push:{allRatings:{...newrating , reviews:[]}}})  //this type of query like push is uded to create a new object and push in array
        }

        
        let allratings = await servicesArray[indexofservice].findOne({_id:serviceid});
        let sum = 0 // calculating the total ratings
        console.log(allratings);
        console.log(sum + "sum");
        allratings.allRatings.map((elm,id)=>{
          console.log(sum)
          return sum=sum + elm.rate;
        })
        console.log(allratings.allRatings.length)
        sum = sum/allratings.allRatings.length;
        let rateupdate = await servicesArray[indexofservice].updateOne({_id:serviceid} , {$set:{ratings:sum}});
        // console.log(allratings);
        console.log("below line");
        console.log(sum);
        console.log(addrating);
        return res.status(200).send({data:addrating});
       }else{
        // return res.status(400).send("login first");
       }
      }
      catch(err){
        // return res.status(401).send("user not login");
        if(err.name==="JsonWebTokenError"){
          return res.status(201).send({message:"notlogin"});
        }else{
          console.log(err);
        }
       
      }
    }
      

  const addreviews=async(req,res)=>{
    try{
       let param = req.params['serviceid'];
       console.log(req.body);
       const {revieww} = req.body;
       console.log(param);
       console.log(revieww);
       let serviceid = req.params['serviceid'].split(":")[0];
       let servicetype = req.params['serviceid'].split(":")[1];
       const token = req.headers.authtoken;
       console.log(token);
       const verifyUser = await jwt.verify(token,process.env.SECREAT_KEY);
       if(verifyUser){
        let loginUser = await users.findOne({_id:verifyUser.id});
        console.log(loginUser);
        let servicetypeArray = ["rentnsell" ,"plumbers", "electritions" , "stationaries" , "gyms" , "medicines" , "carpenters"];
        let servicesArray = [rentHouse , plumbers , electritions , stationaries , gyms ,  medicines , carpenters];
        let indexofservice = servicetypeArray.indexOf(servicetype);
        let isexistreviewer = await servicesArray[indexofservice].findOne({_id:serviceid , allRatings : {$elemMatch:{userId:loginUser._id}}});
        let updatedservice
        if(isexistreviewer){
           updatedservice = await servicesArray[indexofservice].updateOne({_id:serviceid , "allRatings.userId":loginUser._id} , {$push:{"allRatings.$.reviews" :revieww}})
        }else{
          const newratings = {
            userId:loginUser._id,
            user:loginUser.name,
            img:loginUser.userImg,
            reviews:[revieww]
          }
           updatedservice = await servicesArray[indexofservice].updateOne({_id:serviceid} , {$push:{allRatings:newratings}})
        }
        
        return res.send(updatedservice);
       }else{
        return res.status(400).send("login first");
       }
       

    }catch(err){
      if(err.name==="JsonWebTokenError"){
        return res.status(201).send({message:"notlogin"});
      }else{
        console.log(err);
      }
    }
  }

module.exports = {saveservice , addratings , addreviews}