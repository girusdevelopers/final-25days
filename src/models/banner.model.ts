import mongoose from "mongoose";

type Banner ={
  bannerKey:string,
    Banner_location: string,
    status: string,
}

// Create a Mongoose schema for the Article type
const articleSchema = new mongoose.Schema<Banner>({
 
  Banner_location: String,
  bannerKey:String,
  status: {
    type: String,
    enum: ["Offline", "Online"],
    default: "Online",
  },
});

// Create a Mongoose model for the Article type
const Banner = mongoose.model("Banner", articleSchema);

export default Banner;
