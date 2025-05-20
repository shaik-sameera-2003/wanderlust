const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");
module.exports.review=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newrev=new Review(req.body.review);
    newrev.author=req.user._id;
    listing.reviews.push(newrev);
    await newrev.save();
    await listing.save();
    req.flash("success","New review is created!");
    res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewsid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewsid}})
    await Review.findByIdAndDelete(reviewsid);
    req.flash("success","review is deleted");
    res.redirect(`/listings/${id}`);
};