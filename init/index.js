require('dotenv').config();
const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initdata=require("./data.js");
const url=process.env.MONGO_URL;
async function main(){
    await mongoose.connect(url);
}
main().then(()=>{console.log("connected to db");}).catch((err)=>{console.log(err)});

const initDB= async ()=>{
    // await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"682c2e693db0c6a36990a2ff"}));
    await Listing.insertMany(initdata.data);
    console.log("saved");
}
initDB();