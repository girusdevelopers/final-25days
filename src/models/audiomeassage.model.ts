
import mongoose from "mongoose";




const audiomessageSchema = new mongoose.Schema({
    audiomessage:String,
  artist:String,
  lyrics:String,
  MusicKey:String,
  BannerKey:String,
  Audio_location:String,
  Banner_location:String,
  download_file:String
});

const AudioMessage = mongoose.model('audiomessage', audiomessageSchema); // 'Song' is the model name
export default AudioMessage;