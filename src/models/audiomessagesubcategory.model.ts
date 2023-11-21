
import mongoose from "mongoose";
const currentDate = new Date();
const curr_date= currentDate.toLocaleTimeString();

type audioFiles ={

    Banner:String,
    description:String,
    BannerKey:String,
    Banner_Location:String,
    createdAt: String;
    updatedAt: String;
  }

const audioFilesSchema = new mongoose.Schema({

  audio: String,
    Banner:String,
    description:String,
    BannerKey:String,
    Banner_Location:String,
    
    createdAt: {
        type: String,
       default:new Date()+ curr_date,
      },
      updatedAt: {
        type: String,
      },
    });

const Audiofiles = mongoose.model("audioFiles",audioFilesSchema)
export default Audiofiles;