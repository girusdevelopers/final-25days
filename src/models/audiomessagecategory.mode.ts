
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
        type: String,
       default:new Date()+ curr_date,
      },
      updatedAt: {
        type: String,
      },
    });

const SecondFolder = mongoose.model("secondfolder",SubFolderSchema)
export default SecondFolder;