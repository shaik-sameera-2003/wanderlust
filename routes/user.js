const express=require("express");
const router=express.Router();
const passport=require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveredirecturl } = require("../middleware.js");
const usercontroller=require("../controllers/user.js");

router.get("/signup",usercontroller.getsignup);

router.post("/signup",wrapAsync(usercontroller.signup));

router.get("/login",usercontroller.getlogin);

router.post("/login",saveredirecturl,passport.authenticate("local",
    {failureRedirect:"/login",failureFlash:true}),usercontroller.login);


router.get("/logout",usercontroller.logout);

module.exports=router;