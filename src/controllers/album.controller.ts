import Album from "@/models/album.model";



export const createAlbum = async (req, res) => {
    try {
      const { title } = req.body;
      // Check if an album with the same title already exists
      const existingAlbum = await Album.findOne({ title });
      if (existingAlbum) {
        return res.status(400).json({ error: 'Album with the same title already exists' });
      }
  
      // If not, create a new album
      const album = new Album({ title });
      const savedAlbum = await album.save();
      res.json(savedAlbum);
    } catch (error) {
      res.status(500).json({ error: 'Error creating album' });
    }
  }


  export const getallAlbums =async (req, res) => {
    try {
      const album = await Album.findById(req.params.id, 'title'); // Only fetch the 'title' field
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.json(album);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving album' });
    }
  };


  export const UpdatealbumTitle =async (req, res) => {
    try {
      const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true });
      if (!updatedAlbum) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.json(updatedAlbum);
    } catch (error) {
      res.status(500).json({ error: 'Error updating album' });
    }
  }


  export const deletealbum = async (req, res) => {
    try {
      const deletedAlbum = await Album.findByIdAndDelete(req.params.id);
      if (!deletedAlbum) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.json({ success: 'Album deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting album' });
    }
  }