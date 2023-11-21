import mongoose from "mongoose";
import Article from '@/models/article.model' 
import Audio from "@/models/audio.model"
import Message from "@/models/message.model";
import Magazine from '@/models/magazine.model'

// Define a function for searching across different schemas
 export const search =async (req, res) => {
        const name = req.params.q.toLowerCase();//Extract the search query from the request parameters
      
        try {
          // Search across all schemas
          //Serach for articles with a case-insensitivites partial match on the magazine title
          const articles = await Article.find({ magazineTitle: { $regex: name, $options: 'i' } });
          // Search for magazines using full-text search on an unspecified fiels (replace 'query' with an appropriate field name)
          const messages = await Message.find({ $text: { $search: query } });
          const magazines = await Magazine.find({ $text: { $search: query } });
          const songs = await Audio.find({ $text: { $search: query } });
      
          // Combine and send the results
          const results = { articles, messages, magazines, songs };
          //Respond with the combined searchresults
          res.json(results);
        } catch (error) {
          //Log any errors that occur during the search process
          console.error(error);
          //Respond with a 500 Internal Server Error if an  error ocurs
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };