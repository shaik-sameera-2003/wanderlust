const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReviews,isReviewAuther,isLoggedIn}=require("../middleware.js");
const reviewcontroller=require("../controllers/review.js");

//reviews route
router.post("/",isLoggedIn,validateReviews,wrapAsync(reviewcontroller.review));

//DELETE ROUTE FOR REVIEWS
router.delete("/:reviewsid",isLoggedIn,isReviewAuther,wrapAsync(reviewcontroller.destroyReview));
module.exports=router;