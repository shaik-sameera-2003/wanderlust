const User=require("../models/user.js");
module.exports.getsignup=(req,res)=>{
    res.render("./users/signup.ejs");
};
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newuser= new User({email,username});
        const registereduser=await User.register(newuser,password);
       req.login(registereduser,(err)=>{
        if(err){
            next(err);
        }
         req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
       })
    }catch(er){
        req.flash("error",er.message);
        res.redirect("/signup");
    }
    
};
module.exports.getlogin=(req,res)=>{
    res.render("./users/login.ejs");
};
module.exports.login=async(req,res)=>{
req.flash("success","welcome back to wanderlust!! ");
let url=res.locals.url || "/listings";
res.redirect(url);
};
module.exports.logout=(req,res,next)=>{
req.logout((err)=>{
    if(err){
       return  next(err);
    }
    req.flash("success","You are logged out!!!");
    res.redirect("/listings");
})
};