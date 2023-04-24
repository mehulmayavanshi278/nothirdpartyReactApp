//   all the delete requests function are here
const jwt = require("jsonwebtoken");
const users = require("../Schema/UserSchema");
const rentHouse = require("../Schema/RentSchema")
const plumbers = require("../Schema/plumSchema")
const electritions = require("../Schema/ElecSchema")
const stationaries = require("../Schema/stationSchema");
const gyms = require("../Schema/gymSchema");
const medicines = require("../Schema/medicineSchema");
const carpenters = require("../Schema/carpSchema");

const homerent = require("../homeserviceSchema/rentHomeSchema");
const plumHomes = require("../homeserviceSchema/PlumSchema");
const Elechomes = require("../homeserviceSchema/ElecSchema");
const stathomes = require("../homeserviceSchema/StatHomeschema");
const gymhomes = require("../homeserviceSchema/GymHomeSchema")
const Medhomes = require("../homeserviceSchema/MedicineHomeSchema");
const carphomes = require("../homeserviceSchema/CarpHomeSchema");

const unsaveservice = async(req,res)=>{
    const {serviceid , serviceheader } = req.body;
    // let servicetypeArray = ["rentnsell" ,"plumbers", "electritions" , "stationaries" , "gyms" , "medicines" , "carpenters"];
    // let servicesArray = [rentHouse , plumbers , electritions , stationaries , gyms , , medicines , carpenters];
       try{
        const token = req.headers.authtoken;

        const verifyUser = await jwt.verify(token,process.env.SECREAT_KEY);
        if(verifyUser){
          try{
         let loginUser = await users.findOne({_id:verifyUser.id});
         if(loginUser){
           loginUser.mycart = loginUser.mycart.filter((elm,id)=>{
              return elm.serviceId!=serviceid
           })
           loginUser.likedservices = loginUser.likedservices.filter((elm,id)=>{
            return elm!=serviceid;
           })
           await loginUser.save();
           return res.send({status:200 , message:"one item unsaved from cart" , data:loginUser});
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
  
   const deleteservice=async(req,res)=>{

    try{
     let param = req.params['serviceid'];
     console.log(param);
     let serviceidd = param.split(":")[0];
     let servicetype = param.split(":")[1];
     console.log(serviceidd , servicetype);
     const token = req.headers.authtoken;
      const verifyUser = await jwt.verify(token,process.env.SECREAT_KEY);
      if(verifyUser){
        let servicetypeArray = ["rentnsell" ,"plumbers", "electritions" , "stationaries" , "gyms" , "medicines" , "carpenters"];
        let servicesArray = [rentHouse , plumbers , electritions , stationaries , gyms ,  medicines , carpenters]; 
        let  allservice = [homerent , plumHomes , Elechomes , stathomes , gymhomes , Medhomes , carphomes]
        let indexofservice = servicetypeArray.indexOf(servicetype);
        let service = await  servicesArray[indexofservice].deleteOne({_id:serviceidd});
        let homeservice = await allservice[indexofservice].deleteOne({serviceId:serviceidd});
        let loginuser = await users.updateOne({_id:verifyUser.id},{$pull:{addedServices:{serviesId:serviceidd}}})  // it will delete object from anarray 
        // loginuser.addedServices = loginuser.addedServices.filter((elm,id)=>{
        //   return elm.serviceId!=serviceidd;
        // })
        console.log(service);
        return res.send(loginuser);
      }
    
    }catch(err){
      if(err.name==="JsonWebTokenError"){
        return res.status(201).send({message:"notlogin"});
      }else{
        console.log(err);
      }
   }
  }
   module.exports = {unsaveservice , deleteservice}