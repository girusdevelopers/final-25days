import { Request, Response } from "express";
import Article from "@/models/article.model";
import { sanitizeFileName } from "@/utils/SanitizeFileName";
import { AWS_BUCKET_NAME, AWS_REGION } from "@/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { deleteS3File, s3client } from "@/utils/s3service";
import { v4 as uuidv4 } from "uuid";
// Import your Mongoose model


interface UpdateFields {
  ArticleTitle?: string;
  content?: string;
}

// Controller function to create a new article
export const createArticle = async (req: Request, res: Response) => {
  const { ArticleTitle, content } = req.body;
  const Banner = req.file;

  // console.log(Banner)
  const file2Name = Banner.originalname;
  // console.log(file2Name)
  const BannerName = sanitizeFileName(file2Name);
  
  const Bannerkey = `${uuidv4()}-${BannerName}`
  // console.log(Bannerkey)
  // Upload the image to S3 bucket
  try {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: `uploads/${Bannerkey}`,
    Body: Banner.buffer,
    ContentType: Banner.mimetype,
  };
// Execute S3 upload command  
  const command1 = new PutObjectCommand(params);
  const uploaded1 = await s3client.send(command1);

// Create a new article with the uploaded banner details  
    const ArticleDetails = await Article.create({
      ArticleTitle,
      content,
      BannerKey: params.Key,
      Banner_location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`,
    });
 // Respond with the created article details   
    res.status(201).json(ArticleDetails);
  } catch (error) {
 // Handle errors during article creation/upload   
    res.status(500).json({ error: "Failed to create the article" });
  }
};

// Controller function to get all articles
export const getArticles = async (req: Request, res: Response) => {
  try {
// Fetch all articles from the database and sort them by creation date in descending order    
    const articles = await Article.find().sort({ createdAt: -1 });
// Respond with the fetched articles
    res.status(200).json(articles);
  } catch (error) {
  // Handle errors during article retrieval   
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};


// Controller function to get a specific article by ID
export const getArticleById = async (req: Request, res: Response) => {
  try {
   // Extract the article ID from the request parameters 
    const articleId = req.params.id;
        // Find the article by its ID in the database
    const article = await Article.findById(articleId);
  // If the article is found, respond with a success status and the article details
      
    if (article) {
      res.status(200).json(article);
    } else {
 // If the article is not found, respond with a 404 error     
      res.status(404).json({ error: "Article not found" });
    }
  } catch (error) {
    // Handle errors during article retrieval
    res.status(500).json({ error: "Failed to fetch the article" });
  }
};
//-==+---+++----++++-----+++++++++
// export const getArticleByWord = async (req: Request, res: Response) => {
//     try {
//       const name = req.params.word.toLowerCase();
//       const magazines = await Article.find({});
//       const magazineName = magazines.map((magazineTitle) => magazineTitle.magazine.toLowerCase());
//       console.log(magazineName);

//       let foundMagazines = [];
//       for (const filename of magazineName) {
//         if (filename.includes(name)) {
//           foundMagazines.push(filename);
//         }
//       }
//       if (foundMagazines.length > 0) {
//         res.status(200).json(foundMagazines);
//       } else {
//         res.status(200).json({ message: `${name} Magazine Not Found.` });
//       }
//     } catch (error) {
//       res.status(500).json({ error: "An error occurred while fetching Magazine." });
//     }
//   };//--------------------------------------------------

export const getArticleByName = async (req, res) => {
  // Extract the name parameter from the request
  const { name } = req.params;
  // Convert the name to lowercase for a case-insensitive search
  const lowercaseTitle = name.toLowerCase();

  try {
    const ArticleDetails = await Article.find({ ArticleTitle: lowercaseTitle });

    const ArticleDetailsbyWord = await Article.find({
      ArticleTitle: { $regex: new RegExp(lowercaseTitle, "i") },
    });

    // Check if there are no exact matches
    if (ArticleDetails.length === 0 && ArticleDetailsbyWord.length === 0) {
      return res.status(404).send("No articles found");
    } else if (ArticleDetails.length === 0) {
  // Respond with partial matches if no exact matches are found     
      return res.status(200).json(ArticleDetailsbyWord);
    } else if (ArticleDetailsbyWord.length === 0) {
      // Check if there are no partial matches
      return res.status(200).json(ArticleDetailsbyWord);
    } else {
      // Both exact and partial matches found
      const results = {
        ArticleDetails,
        ArticleDetailsbyWord,
      };
      res.status(200).json({
        success: "successfully",
        results,
      }); 
    }
  } catch (error) {
    // Respond with a 500 error and an error message
    res.status(500).json({ error: "Error retrieving audio details" });
  }
};

// Controller function to update an existing article by ID
export const updateArticle = async (req, res) => {
  // Destructure relevant fields from the request body
  const { ArticleTitle,content } = req.body;

  // Extract audio ID from the route parameters
  const ArticleId = req.params.id; // Assuming you pass the audio ID in the route URL

  try {
    // Create an object to store fields to be updated
    const updateFields: UpdateFields = {};

    // Check if each field is provided in the request body and add it to updateFields
    if (ArticleTitle) updateFields.ArticleTitle = ArticleTitle;
    if (content) updateFields.content = content;

    // Find and update the audio details in the database
    const audio = await Article.findByIdAndUpdate(
      { _id: ArticleId },
      { $set: updateFields },
      { new: true } // Set the 'new' option to true to get the updated document
    );

    // Check if the audio details were found and updated
    if (!audio) {
      return res.status(404).json({ error: "Audio not found" });
    }

    // Create a comma-separated string of updated fields for the success message
    const updatedDetails = Object.keys(updateFields).join(", "); // Create a comma-separated string of updated fields

    // Respond with the success message and the updated audio details
    return res.status(200).json({
      success: `Details (${updatedDetails}) updated successfully`,
      audio,
    });
  } catch (error) {
    return res.status(400).json({ error: "Details not updated." });
  }
};



export const deleteArticleById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the details of the song before deletion
    const deletedSong = await Article.findById(id);
    console.log(deletedSong);
    if (!deletedSong) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Delete the associated files from S3
    // await deleteS3File(deletedSong.MusicKey);
    await deleteS3File(deletedSong.BannerKey);

    // Delete the song from the database
    const deleteArticle = await Article.deleteOne({ _id: id });
// Check if the deletion was successful (deletedCount === 1)
    if (deleteArticle.deletedCount === 1) {
       // If successful, respond with a success message
      return res.status(200).json({
        success: `Song '${deletedSong.ArticleTitle}' and associated files deleted successfully`,
      });
    } else {
      // If deletion was not successful, respond with a 500 error
      return res.status(500).json({ error: "Error deleting song" });
    }
  } catch (error) {
    // Handle any errors that occurred during the deletion process
    return res.status(500).json({ error: "Error deleting audio details" });
  }
};
