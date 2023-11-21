
import mongoose from "mongoose";




const songSchema = new mongoose.Schema({
  Musictitle:String,
  artist:String,
  lyrics:String,
  AlbumName:String,
  MusicKey:String,
  BannerKey:String,
  Audio_location:String,
  Banner_location:String,
  download_file:String
});

const Audio = mongoose.model('audio', songSchema); // 'Song' is the model name
export default Audio;