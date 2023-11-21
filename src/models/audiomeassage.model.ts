// import mongoose from "mongoose";

// const audiomessageSchema = new mongoose.Schema({
//   audiomessage:String,
//   artist:String,
//   lyrics:String,
//   MusicKey:String,
//   BannerKey:String,
//   Audio_location:String,
//   Banner_location:String,
//   download_file:String
// });

// const AudioMessage = mongoose.model('audiomessage', audiomessageSchema); // 'Song' is the model name
// export default AudioMessage;


import mongoose from "mongoose";
const currentDate = new Date();
const curr_date= currentDate.toLocaleTimeString();

type MainFolder ={

    folderName:string;
    BannerKey:String,
    Banner_Location:String,
    createdAt: String;
    updatedAt: String;
  }

const MainFolderSchema = new mongoose.Schema({

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

const FirstFolder = mongoose.model("mainfolder",MainFolderSchema)
export default FirstFolder;