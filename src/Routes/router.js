const express = require("express");
const router = express.Router();

const multer  = require('multer');
const users = require("../Schema/UserSchema");
const {register , login , logout , addtoselleraccount , addrentandsell , addplumelec , addserviceto } = require("../controllers/controllers");
const {homepage , getprofileinfo , getsingleservice , allhomeservices , allplumnelec , allsgmcservices}  = require("../controllers/getcontrollers");
const {unsaveservice , deleteservice}  = require("../controllers/deletecontrollers");
const {saveservice , addratings , addreviews} = require("../controllers/pulcontrollers");





const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "images");
      
    },
    filename: function (req, file, cb) {
        // const ext = file.mimetype.split("/")[1];
        const ext = file.originalname.substring(file.originalname.lastIndexOf("."));
        console.log(ext);
    //   cb(null,  Date.now() +  '-' + file.originalname + ext  )
      cb(null,file.originalname)
      
    },
  })
  
  const upload = multer({ storage: storage })

// router.post("/post", upload.single('uploaded_file'),  (req,res)=>{
//     console.log("uploaded");
//     return res.send("uploaded successfully " + req.file.originalname);   
// })

// get routers
router.get("/",homepage)
router.get("/profileinfo" , getprofileinfo)
router.get("/getsingleservice/:serviceidandtype" , getsingleservice)
router.get("/allhomeservices" , allhomeservices);
router.get("/allplumnelec/:servicetype" , allplumnelec);
router.get("/allsgmcservices/:servicetype" , allsgmcservices)

//   post routers
router.post("/register",register)
router.post("/login" , login)
router.get("/logout",logout)
router.post("/addtoselleraccount",addtoselleraccount)
// router.post("/addrentandsell", upload.array('uploaded_file',10) , addrentandsell)
router.post("/addrentandsell" , addrentandsell)
// router.post("/addplumelec", upload.single('uploaded_file') ,addplumelec)
router.post("/addplumelec" ,addplumelec)
// router.post("/addservice/:servicename" , upload.array('uploaded_file' , 10) , addserviceto)
router.post("/addservice/:servicename" , addserviceto)

router.put("/addratings/:serviceid", addratings)
router.put("/addreviews/:serviceid", addreviews)
router.put("/deleteservice/:serviceid" , deleteservice)


router.post("/saveservice" , saveservice)


router.put("/unsaveservice" , unsaveservice)
module.exports = router;