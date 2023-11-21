
import mongoose from "mongoose";
const currentDate = new Date();
const curr_date= currentDate.toLocaleTimeString();

type SubFolder ={

    folderName:string;
    BannerKey:String,
    Banner_Location:String,
    createdAt: String;
    updatedAt: String;
  }

const SubFolderSchema = new mongoose.Schema({

  folderName: String,
    Banner:String,
    BannerKey:String,
    Banner_Location:String,
    
    createdAt: {
      type: Date,
      default: Date.now,
      },
      updatedAt: {
        type: Date,
    default: Date.now,
      },
    });

const SecondFolder = mongoose.model("secondfolder",SubFolderSchema)
export default SecondFolder;