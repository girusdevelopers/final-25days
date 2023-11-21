// models/Album.js
import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  albumkey: {
    type: String,
    required: true,
  },
  album_banner: {
    type: String,
    required: true,
  },
});

const Album = mongoose.model('Album', albumSchema);

export default Album;
