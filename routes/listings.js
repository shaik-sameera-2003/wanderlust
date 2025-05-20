const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingcontroller=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage })
const Listing=require("../models/listing.js");
router.get("/search",listingcontroller.search);
router.get("/filter",listingcontroller.filter);
//index route to show all listings
router.get("/",wrapAsync(listingcontroller.index));

//create route to create new list
router.get("/new",isLoggedIn,listingcontroller.newlistingform);

//to save and show new list in the DB and web page
router.post("/",isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingcontroller.savenewlisting));
//show route to show individual list
router.get("/:id",wrapAsync(listingcontroller.showIndividual));

//edit route to edit the existing list
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.edit));

//UPDATE route to put the edited data in the db
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingcontroller.update));

//Delete route to delete the list in db
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingcontroller.destroy));

module.exports=router;