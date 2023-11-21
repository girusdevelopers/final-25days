import mongoose from "mongoose";

type Banner ={
  bannerKey:string,
    Banner_location: string
}

// Create a Mongoose schema for the Article type
const articleSchema = new mongoose.Schema<Banner>({
 
  Banner_location: String,
  bannerKey:String
});

// Create a Mongoose model for the Article type
const Banner = mongoose.model("Banner", articleSchema);

export default Banner;
