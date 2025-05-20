require('dotenv').config();
const express=require("express");
let app=express();
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const ejsMate=require("ejs-mate");
const path=require("path");
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
const mongoose=require("mongoose");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");

const listingroute=require("./routes/listings.js");
const reviewroute=require("./routes/review.js");
const userroute=require("./routes/user.js");
const dburl=process.env.MONGO_URL;
async function main(){
    await mongoose.connect(dburl);
}
main().then(()=>{console.log("connected to db");}).catch((err)=>{console.log(err)});
let store=MongoStore.create({
    mongoUrl:process.env.MONGO_URL,
    secret:"mysecrectcode",
     touchAfter: 24 * 3600 
})
let sessionOptions={
    store,
    secret:"myfirstsession",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
})


app.use("/listings",listingroute);
app.use("/listings/:id/reviews",reviewroute);
app.use("/",userroute);
app.get("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})
app.use((err,req,res,next)=>{
    let {statuscode=500,message="some error"}=err;
 res.status(statuscode).render("./listings/error.ejs",{message});
})
app.listen(8080,(req,res)=>{
    console.log("app is listening");
})