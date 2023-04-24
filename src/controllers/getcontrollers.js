const rentHouse = require("../Schema/RentSchema")
const plumbers = require("../Schema/plumSchema")
const electritions = require("../Schema/ElecSchema")
const stationaries = require("../Schema/stationSchema");
const gyms = require("../Schema/gymSchema");
const medicines = require("../Schema/medicineSchema");
const carpenters = require("../Schema/carpSchema");
const img = require("../homeserviceSchema/homepic");


const homerent = require("../homeserviceSchema/rentHomeSchema");
const plumHomes = require("../homeserviceSchema/PlumSchema");
const Elechomes = require("../homeserviceSchema/ElecSchema");
const stathomes = require("../homeserviceSchema/StatHomeschema");
const gymhomes = require("../homeserviceSchema/GymHomeSchema")
const Medhomes = require("../homeserviceSchema/MedicineHomeSchema");
const carphomes = require("../homeserviceSchema/CarpHomeSchema");

const users = require("../Schema/UserSchema");
const jwt = require("jsonwebtoken")

const homepage=async(req,res)=>{
    try{
    
     let randomservice = Math.floor(Math.random()*(7)); // createing the random number for the all categories
     let  allservice = [homerent , plumHomes , Elechomes , stathomes , gymhomes , Medhomes , carphomes]  //real service which are imported in headers
    let   allservice2 = ["rentnsell" ,"plumbers", "electritions" , "stationaries" , "gyms" , "medicines" , "carpenters"]  //string to confirm which service is recieved at a frontend
     let singleservice = await allservice[randomservice].find({});  //dynamically retriewing services objects
     if(singleservice){
        if(singleservice.length<10){
          
         return res.send({status:200 , data:singleservice , categories:allservice2[randomservice]});
        }else{
            let rendom = Math.floor(Math.random()*(3-1) + 1) //createing the random number between 1 and 5
            let service = []   //creating a empty array to store rendom service objects
            for(let i=0;i<10;i++){
             service.push(singleservice[rendom]);   // push the random object in service array
             rendom+=2
            }
            
            return res.send({status:200,categories:allservice2[randomservice],data:service});  // parsing the random stored services in service array
        }
        
     }
    }catch(err){
        console.log(err);
    }
}


  const getprofileinfo=async(req,res)=>{
       try{
         const token = req.headers.authtoken;
         let verifyuser = await jwt.verify(token , process.env.SECREAT_KEY);
         if(verifyuser){
           let loginUser = await users.findOne({_id:verifyuser.id});
           if(loginUser){
            return res.send({status:200 , data:loginUser});
           }
         }else{
            return res.status(401).send(" invalid authtoken")
         }

       }catch(err){
        console.log(err);
       }
  }

  const getsingleservice=async(req,res)=>{
     const param = req.params['serviceidandtype'];
     console.log(param);
     const serviceid = param.split(":")[0];
     const servicetype = param.split(":")[1];
     console.log(servicetype);
     let servicetypeArray = ["rentnsell" ,"plumbers", "electritions" , "stationaries" , "gyms" , "medicines" , "carpenters"];
    let servicesArray = [rentHouse , plumbers , electritions , stationaries , gyms ,  medicines , carpenters];
    const indexofservice = servicetypeArray.indexOf(servicetype);  // this array method gives n an index of an servicetype useful for dynamic findone method
    console.log(indexofservice);
    try{
      const service = await servicesArray[indexofservice].findOne({_id:serviceid});
    if(service){
      return res.status(200).send({data:service , message:servicetype});
    }else{
      return res.status(400).send("service not found");
    }
    }catch(err){
      console.log(err);
      return res.send(err);
    }
   
    
  }

  const allhomeservices=async(req,res)=>{
    try{
      const services = await rentHouse.find({});
      if(services){
        return res.status(200).send({data:services , message:"rentnsell"});
      }else{
        return res.status(401).send("not found all home services");
      }
    }catch(err){
      console.log(err);
    }
  }
  const allplumnelec=async(req,res)=>{
    try{
     const param = req.params['servicetype'];
     console.log(param)
     const allservices = ["plumbers" , "electritions"];
     const allservices2 = [plumbers , electritions];
     const indexofservice = allservices.indexOf(param);
     const singleservice = await allservices2[indexofservice].find({});
     if(singleservice){
      return res.status(200).send({data:singleservice , message:allservices[indexofservice]});
     }else{
      return res.status(400).send("all services not found");
     }
    }catch(err){
      return res.send(err);
      console.log(err);
    }
  }
  const allsgmcservices=async(req,res)=>{
    try{
       const param = req.params['servicetype'];
       console.log(param);
       let  allservice = [stationaries , gyms , medicines , carpenters]  
       let   allservice2 = [ "stationaries" , "gyms" , "medicines" , "carpenters"] 
       let indexofservice = allservice2.indexOf(param);
       let service = await allservice[indexofservice].find({});
       if(service){
        return res.status(200).send({data:service , message:allservice2[indexofservice]});
       }else{
        return res.status(400).send("not found this service");
       }
    }catch(err){
      console.log(err);
    }
  }
module.exports = {homepage , getprofileinfo , getsingleservice , allhomeservices , allplumnelec , allsgmcservices};