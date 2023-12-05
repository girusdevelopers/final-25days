
import mongoose from "mongoose";

const currentDate = new Date();

const VideoSchema = new mongoose.Schema({
  Videotitle:String,
  artist:String,
  description:String,
  MainmostFolderName:String,
  SubFolderName:String,
  VideoKey:String,
  VideoBannerKey:String,
  Video_location:String,
  VideoBanner_location:String,
  createdAt: {
    type: Date,
   default: currentDate,
  },
});


const  Video = mongoose.model('VideoFolder', VideoSchema); // 'Song' is the model name
export default  Video;