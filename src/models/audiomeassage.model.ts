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

type Message ={

    description:string;
    File_Location:String;

    BannerKey:String,
    Banner_Location:String,
    createdAt: String;
    updatedAt: String;
  }

const messageSchema = new mongoose.Schema({

  description: String,

    // Banner:String,
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
    messageSchema.pre("save", function (this: Message & mongoose.Document, next) {
      this.updatedAt = new Date() + curr_date;
      next();
    });


const Message = mongoose.model("message",messageSchema)
export default Message;