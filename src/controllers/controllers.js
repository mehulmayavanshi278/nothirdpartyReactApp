const cloudinary = require('cloudinary').v2;
const users = require("../Schema/UserSchema");
const rentHouse = require("../Schema/RentSchema")
const plumbers = require("../Schema/plumSchema")
const electritions = require("../Schema/ElecSchema")
const stationaries = require("../Schema/stationSchema");
const gyms = require("../Schema/gymSchema");
const medicines = require("../Schema/medicineSchema");
const carpenters = require("../Schema/carpSchema");
const profilePic = require("../../src/profilepicSchema/profilepic");
const  bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const homerent = require("../homeserviceSchema/rentHomeSchema");
const plumHomes = require("../homeserviceSchema/PlumSchema");
const Elechomes = require("../homeserviceSchema/ElecSchema");
const stathomes = require("../homeserviceSchema/StatHomeschema");
const gymhomes = require("../homeserviceSchema/GymHomeSchema")
const Medhomes = require("../homeserviceSchema/MedicineHomeSchema");
const carphomes = require("../homeserviceSchema/CarpHomeSchema");
const { relativeTimeRounding } = require('moment');

const register = async(req,res)=>{
    try{
        const {name , email , password} = req.body
    console.log(name , email , password );
    let isEmailExist = await users.findOne({email});
    if(isEmailExist){
      return res.status(201).send({message:"Email already signed in"})
    }else{
      const profilepics = await  profilePic.find();
      console.log(profilepics)
      let userImage 
      profilepics[0].images.map((elm,id)=>{
        if(elm.imgProfile.charAt(0) == name.charAt(0)){
         userImage = elm
        }
      })
      const newuser = new users({name , email , password , userImg:userImage.imgProfile});
      await newuser.save();
      return res.send({status:200,data:newuser});
    }

    }catch(err){
        console.log(err);
    }
   
}
const login = async(req,res)=>{
  try{
    const {email , password} = req.body;
    console.log("login" + email , password);
    const registeredUser = await users.findOne({email});

    if(registeredUser ){
      const checkPW = await bcrypt.compare(password , registeredUser.password);
      if(checkPW){
        const token = await registeredUser.generateAuthToken();
        if(token){
            registeredUser.tokens=registeredUser.tokens.concat({token});
            
            return res.send({status:200,message:"login successfully",token:token})
        }else{
            console.log("token not grnerated");
        }
      }

    }else{
        res.status(201).send({message:"invalid login details"});
    }
  }catch(err){
    console.log(err);
  }

}
const logout = async(req,res)=>{
  try{
    console.log(req.headers.authtoken)
    const authtoken = req.headers.authtoken;
    const verifyUser = await jwt.verify(authtoken , process.env.SECREAT_KEY);
    console.log(verifyUser);
    const loginUser = await users.findOne({_id:verifyUser.id});
    console.log(loginUser);
    loginUser.tokens = loginUser.tokens.filter((elm,id)=>{
        return id==loginUser.tokens.lenth-1
    })
    await loginUser.save();
    return res.send({status:200,message:"logout successfully"});
  }catch(err){
    if(err.name==="JsonWebTokenError"){
      return res.status(201).send({message:"notlogin"});
    }else{
      console.log(err);
    }
  }
}
const addtoselleraccount = async(req,res)=>{
    try{
        console.log(req.headers);
        const token = req.headers.authtoken;

        console.log(token);
        const {mobile , whatsApp , zender , age} = req.body;
        console.log(mobile , whatsApp , zender , age)
        const verifyUser = await jwt.verify(token,process.env.SECREAT_KEY);
        console.log(verifyUser);
        if(verifyUser){
            let loginUser = await users.updateMany({_id:verifyUser.id},{$set:{mobile,whatsApp,zender,age , isServiceProvider:true}}); 
            //  loginUser.addedServices=loginUser.addedServices.concat({role:"Rent & Sell",name:loginUser.name,})
            // await loginUser.save(); not neede to write after updating 
            return res.send({status:200,data:loginUser,message:"added To Seller Account Successfully"});      
        }else{
            console.log("not valid auth token");
            return res.status(401).send("invalid Token");
        }
  
    }catch(err){
      if(err.name==="JsonWebTokenError"){
        return res.status(201).send({message:"notlogin"});
      }else{
        console.log(err);
      }
    }
}
   const addrentandsell=async(req,res)=>{
    try{
      
        // console.log(homeType , carParking);
        // console.log(req.headers);
        const token = req.headers.authtoken;
        //  for(let i=0;i<req.files.length;i++){
        //     console.log(i);
        //  }
        const uploadFiles = req.files.uploaded_file.map((elm)=>{
          return cloudinary.uploader.upload(elm.tempFilePath);
        });
        const result = await Promise.all(uploadFiles);
        console.log(result);
        let img = []

       const verifyUser = await jwt.verify(token , process.env.SECREAT_KEY);
    //    console.log(verifyUser)
       const loginUser = await users.findOne({_id:verifyUser.id});
    //    console.log(loginUser)
       let {name , mobile , whatsApp  } = loginUser
       const { area, homeType, carParking, totalBedRooms , totalBath, bhk, furnishing, totalFloors, bachlorsAllowed, soceityName, Rent, location, address, desc} = req.body
    //    console.log( area, homeType, carParking, totalBedRooms, totalBath, bhk, furnishing, totalFloors, bachlorsAllowed, soceityName, Rent, location, address)
       let images = [];
       let newimg 
       for(let i=0;i<result.length;i++){
        newimg ={
          img:result[i].url
        }
        images.push(newimg)
       }
       console.log("images :" , images)
    //    console.log(images);
       let newRent = new rentHouse({name , mobile , whatsApp , area , homeType , carParking ,  totalBedRooms, totalBath, bhk, furnishing, totalFloors, bachlorsAllowed, soceityName, Rent, location, address , desc});
         for(let i=0;i<images.length;i++){
          console.log(i);
        newRent.homeImages=  newRent.homeImages.concat({img :images[i].img});
       }
  
       await newRent.save();
       console.log(newRent);
       loginUser.addedServices =  loginUser.addedServices.concat({name , img:images[0].img ,  role:"rentnsell" , serviesId:newRent._id}); //adding the service to the addedservice in users account
       await loginUser.save();
       let newhomerent = await new homerent({serviceId:newRent._id , Rent:newRent.Rent,  area:newRent.area , postedTime:newRent.postedTime , img:newRent.homeImages[0].img , desc:newRent.desc})   //adding the service to the homerent schema which will be shown to the home page of client
       await newhomerent.save();
       return res.send({status:200,data:newRent,message:"added to rentHome"});
    }catch(err){
      if(err.name==="JsonWebTokenError"){
        return res.status(201).send({message:"notlogin"});
      }else{
        console.log(err);
      }
    }
   }

//    the function which add the plumber and electrition
   const addplumelec=async(req,res)=>{
    


      try{
        const {area , role , exp , bio , timing} = req.body;
        const token = req.headers.authtoken;
        console.log("i am in try  block");
        const file = req.files.uploaded_file;
        // console.log(file);
        let img
         await cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{
           img=result.url
           console.log(result);
        })
  
         console.log(img);

        // console.log(req.file);
        // console.log(area , role , exp , bio , timing);
        const verifyUser = await jwt.verify(token , process.env.SECREAT_KEY);
        let loginUser = await users.findOne({_id:verifyUser.id});
        const {name , mobile , whatsApp , age , zender} = loginUser
        if(loginUser){
            if(role ==="electritions"){
                let newelec = new electritions({name , age,zender , role , mobile , whatsApp , area , exp , bio ,timing , img});
                 await  newelec.save();
                 loginUser.addedServices = loginUser.addedServices.concat({name,role,img , serviesId:newelec._id});
                 await loginUser.save();
                 let newhomeplum = await new Elechomes ({serviceId:newelec._id , name , role , area , exp , mobile  , img});   //this lines will add the the service to the homeelecschema data will be shown to the home page of client side
                 await newhomeplum.save();
                 return res.send({status:200,data:newelec,message:"added one electrition"});
             }else if(role==="plumbers"){
                let newplum = new plumbers({area , role , exp , bio , timing , name , mobile , whatsApp , age , zender , img});
                 await newplum.save();
                 loginUser.addedServices = loginUser.addedServices.concat({name , role , img , serviesId:newplum._id});
                 await loginUser.save();
                 let newhomeelec = await new  plumHomes({serviceId:newplum._id , name , role , area , exp , mobile  , img});  //this line will add the the service to the homeelecschema data will be shown to the home page of client side
                 await newhomeelec.save();
                 return res.send({status:200,data:newplum,message:"added one plumber"});
             }
        }
        

      }catch(err){
        if(err.name==="JsonWebTokenError"){
          return res.status(201).send({message:"notlogin"});
        }else{
          console.log(err);
        }
      }
   }



//    this function will add the stationary gym carpenter and medicines
   const addserviceto=async(req,res)=>{  
    try{
        const service = req.params['servicename'];
        const token = req.headers.authtoken;
        const { area,openTime,closeTime,openDays,storeName,address,location} = req.body;
        let imgpath=[]

        const uploadFiles = req.files.uploaded_file.map((elm)=>{
          return cloudinary.uploader.upload(elm.tempFilePath);
        });
        const result = await Promise.all(uploadFiles);
        console.log(result);
        for(let i=0;i<result.length;i++){
          imgpath.push(result[i].url)
        }
        const verifyUser = await jwt.verify(token,process.env.SECREAT_KEY);
        let loginUser = await users.findOne({_id:verifyUser.id});
        const {name , age , zender , mobile , whatsApp } = loginUser
 

         if(loginUser){
          if(service==="gyms"){
            console.log("gyms");
            let newgym = new gyms({name , mobile , whatsApp , age , zender , area,openTime,closeTime,openDays,storeName,address,location });
            for(let i=0;i<imgpath.length;i++){
                newgym.Images=newgym.Images.concat({img : imgpath[i].url});
            }
             await newgym.save();
             loginUser.addedServices = loginUser.addedServices.concat({name:loginUser.name ,serviesId:newgym._id , role:service , img:imgpath[0]  });
             await loginUser.save();
             let newHomegym = await new gymhomes({serviceId:newgym._id , area , storeName , mobile , openTime , closeTime , img:imgpath[0]});  // this will the service to the homegymschema anf it will be shown to the client on home page 
             await newHomegym.save();
          }else if(service==="medicines"){
            console.log("m");
            let newmed = new medicines({name , mobile , whatsApp , age , zender , area , openTime , closeTime , openDays ,storeName ,address,location});
            console.log(newmed);
            for(let i=0;i<imgpath.length;i++){
               newmed.Images=newmed.Images.concat({ img : imgpath[i] });
            }
            await newmed.save();
            loginUser.addedServices = loginUser.addedServices.concat({name:loginUser.name ,serviesId:newmed._id , role:service , img:imgpath[0]});
            await loginUser.save();
            let newHomemed = await new Medhomes({serviceId:newmed._id , area , storeName , mobile , openTime , closeTime , img:imgpath[0]});  // this will the service to the homemedicineSchema and it will be shown to the client on home page 
            await newHomemed.save();

          }else if(service==="carpenters"){
            // console.log("c");
            let newcarp = new carpenters({name , mobile , whatsApp , age , zender , area,openTime,closeTime,openDays,storeName,address,location})
            for(let i=0;i<imgpath.length;i++){
                newcarp.Images = newcarp.Images.concat({img:imgpath[i]});
            }
            
            await newcarp.save();
            loginUser.addedServices = loginUser.addedServices.concat({name:loginUser.name ,serviesId:newcarp._id , role:service , img:imgpath[0]});
            await loginUser.save();
            let newHomecarp = await new carphomes({serviceId:newcarp._id , area , storeName , mobile , openTime , closeTime , img:imgpath[0]});  // this will the service to the homecarpSchema and it will be shown to the client on home page 
            await newHomecarp.save();
          }else if(service==="stationaries"){
            let newstatn = new stationaries({name , mobile , whatsApp , age , zender , area,openTime,closeTime,openDays,storeName,address,location});
            for(let i=0;i<imgpath.length;i++){
                newstatn.Images = newstatn.Images.concat({img:imgpath[i]});
            }
            await newstatn.save();
            loginUser.addedServices=loginUser.addedServices.concat({name:loginUser.name ,serviesId:newstatn._id , role:service , img:imgpath[0]});
            await loginUser.save();
            let newStatHome = await new stathomes({serviceId:newstatn._id , area , storeName , mobile , openTime , closeTime , img:imgpath[0]});  // this will the service to the homestathomesSchema and it will be shown to the client on home page 
            await newStatHome.save();
          }
          return res.status(200).send({message:`one ${service} added to services`});
         }
    }catch(err){
        console.log(err);
    }    
     
     
   }


  


module.exports = {register , login , logout , addtoselleraccount , addrentandsell , addplumelec , addserviceto}