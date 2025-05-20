const { object, string } = require("joi");
const mongoose=require("mongoose");
let Schema=mongoose.Schema;
let Review= require("./reviews.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String
    },
    price:{
        type:Number
    },
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }
    ] ,
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        enum:["mountain-city","mountain","hiking","pools","island","trending","domes"]
    }
    
    
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
       await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
let Listing=new mongoose.model("Listing",listingSchema);

module.exports=Listing;