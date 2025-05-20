const Listing=require("./models/listing");
const Review=require("./models/reviews");
const ExpressError=require("./utils/ExpressError.js");
const {validateSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
        req.flash("error","please login!!") ;
         return res.redirect("/login");
     }
     next();
};
module.exports.saveredirecturl=(req,res,next)=>{
 res.locals.url=req.session.redirecturl;
 next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curruser._id)){
       req.flash("error","You are not a authorized person for this listing!!!!!!");
     return res.redirect(`/listings/${id}`); 
    }
    next();
};

module.exports.validateListing=(req,res,next)=>{
    let {error}=validateSchema.validate(req.body);
    if(error){
      throw new ExpressError(400,error);
    }else{
        next();
    }
};
module.exports.validateReviews=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
      throw new ExpressError(400,error);
    }else{
        next();
    }
};

module.exports.isReviewAuther=async(req,res,next)=>{
    let {id,reviewsid}=req.params;
    let review=await Review.findById(reviewsid);
    if(!review.author._id.equals(res.locals.curruser._id)){
       req.flash("error","you are not autherized to delete this review");
     return res.redirect(`/listings/${id}`); 
    }
    next();
};