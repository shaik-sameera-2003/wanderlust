const Listing=require("../models/listing.js");
module.exports.index=async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};
module.exports.newlistingform=(req,res)=>{
    res.render("./listings/new.ejs");
};
module.exports.savenewlisting=async(req,res,next)=>{
        let newlist= new Listing(req.body.listing);
        let url=req.file.path;
        let filename=req.file.filename;
        newlist.owner=req.user._id;
        newlist.image={url,filename}
        await newlist.save();
        req.flash("success","New listing is created!!");
        res.redirect("/listings");
};
module.exports.showIndividual=async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"},})
    .populate("owner");
    if(!list){
        req.flash("error","the list you searched does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{list});
};
module.exports.edit=async(req,res)=>{
let {id}=req.params;
let list=await Listing.findById(id);
if(!list){
    req.flash("error","the list you searched does not exist");
    res.redirect("/listings");
}
res.render("./listings/edit.ejs",{list});
};
module.exports.update=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,req.body.listing,{runValidators:true})
    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
     await listing.save();
    }
    
    req.flash("success","updated successfully!!!");
    res.redirect(`/listings/${id}`);
};
module.exports.destroy=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","list was deleted successfully!!!");
    res.redirect("/listings"); 
};
module.exports.search=async(req,res)=>{
 const query = req.query.q;
let list=await Listing.findOne({title: { $regex: `^${query}$`, $options: 'i' } })
.populate({path:"reviews",populate:{path:"author"},})
    .populate("owner");
if(!list){
   req.flash("error","no listing found");
   res.redirect("/listings");
}
 res.render("./listings/show.ejs",{list});
};
module.exports.filter=async(req,res)=>{
  const category = req.query.category;
  const allListings = await Listing.find({ category });
 res.render("./listings/index.ejs",{allListings});
};