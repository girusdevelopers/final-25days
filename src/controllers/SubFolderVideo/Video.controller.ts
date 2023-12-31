import Video from "@/models/SubFolderVideo/Video.model";
import MainFolder from "@/models/SubFolderVideo/MainFolder.model";
import SubFolder from "@/models/SubFolderVideo/SubFolder.model";
import { sanitizeFileName } from "@/utils/SanitizeFileName";
import { s3client } from "@/utils/s3service";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import Videomessage from "@/models/SubFolderVideo/Video.model";


// export const uploadVideo = async (req, res) => {
//   try {
//     // Extract relevant data from the request body
//     const { Videotitle, description, MainmostFolderName, SubFolderName, YoutubeUrl } = req.body;

//     console.log(req.body);

//     if (!Videotitle) {
//       return res.status(400).json({ error: "Video title is a required field" });
//     }

//     if (!description) {
//       return res.status(400).json({ error: "Description is a required field" });
//     }

//     if (!MainmostFolderName) {
//       return res.status(400).json({ error: "MainmostFolderName is a required field" });
//     }

//     if (!SubFolderName) {
//       return res.status(400).json({ error: "SubFolderName is a required field" });
//     }

//     if (!YoutubeUrl) {
//       return res.status(400).json({ error: "YoutubeUrl is a required field" });
//     }

//     const existingSub = await SubFolder.findOne({
//       SubFolderName: { $regex: new RegExp(`^${SubFolderName}$`, 'i') },
//     });

//     const existingMain = await MainFolder.findOne({
//       MainmostFolderName: { $regex: new RegExp(`^${MainmostFolderName}$`, 'i') },
//     });

//     if (!existingSub || !existingMain) {
//       return res.status(500).json({ message: "Please provide valid folder name" });
//     }

//     if (existingSub && existingMain) {
//       const VideosMessage = await Video.create({
//         Videotitle,
//         YoutubeUrl,
//         description,
//         MainmostFolderName,
//         SubFolderName,
//       });

//       // Respond with success message and the created video entry
//       return res.status(201).json({
//         success: "Video Message added successfully",
//         VideosMessage,
//       });
//     }
//   } catch (error) {
//     // Handle errors by responding with the error details
//     console.error(error);
//     return res.status(500).json(error);
//   }
// };

export const uploadVideoMessage = async (req, res) => {
  // Extract relevant data from the request body
  const { Videotitle, description, MainmostFolderName, SubFolderName,YoutubeUrl } = req.body;

  // Extract music and banner files from the request

  if (!Videotitle || !description || !MainmostFolderName || !SubFolderName || !YoutubeUrl ) {
      return res.status(400).json({ error: "Please provide all required fields and files" });
  }

  try {
      // Check if the specified subfolder exists within any main folder
      // const existingSub = await SubFolder.findOne({
      //   SubFolderName,
      // });
      //   console.log(existingSub)
      // if (!existingSub) {
      //     return res.status(500).json({ message: "Subfolder does not exist" });
      // }

      // // Find the main folder based on the MainmostFolderName in the existingSub
      // const existingMain = await MainFolder.findOne({
      //     MainmostFolderName: existingSub.MainmostFolderName,
      // });
      // console.log(existingMain)
      // if (!existingMain) {
      //     return res.status(500).json({ message: "Main folder does not exist for the specified subfolder" });
      // }
      const existingMain = await MainFolder.findOne({
        MainmostFolderName: { $regex: new RegExp(`^${MainmostFolderName}$`, 'i') },
    });

    if (!existingMain) {
        return res.status(500).json({ message: "Main folder does not exist" });
    }

    // Check if the specified subfolder exists within the main folder
    const existingSub = await SubFolder.findOne({
        MainmostFolder: existingMain._id,
        SubFolderName: { $regex: new RegExp(`^${SubFolderName}$`, 'i') },
    });

    if (!existingSub) {
        return res.status(500).json({ message: "Subfolder does not exist within the specified main folder" });
    }
      // Process music details
      

      // Set up parameters for uploading music file to S3
     

      // Set up parameters for uploading banner file to S3
  

      

      // Create the audio message entry
      const audiomesssage = await Videomessage.create({
          Videotitle,
          description,
          MainmostFolderName: existingMain.MainmostFolderName,
          SubFolderName,
          YoutubeUrl
      });

      // Respond with success message and the created audio entry
      return res.status(201).json({
          success: "Song added successfully",
          audiomesssage,
      });
  } catch (error) {
      // Handle errors by responding with the error details
      return res.status(500).json(error);
  }
};



 export const getMainFolderByName = async (req, res) => {
   // Extract the name parameter from the request
   try {
    const { MainFolderName } = req.params;
      console.log(MainFolderName)
     // Convert the name to lowercase for a case-insensitive search
     const lowercaseTitle = MainFolderName.toLowerCase();
 
 
     // const ArticleDetails = await MainFolder.find({ MainFolderName: lowercaseTitle });
 
     const ArticleDetailsbyWord = await Video.find({
       MainmostFolderName: { $regex: new RegExp(lowercaseTitle, "i") },
     });
     if (ArticleDetailsbyWord.length === 0) {
           // Check if there are no partial matches
           return res.status(200).json("not found");
         } else {
           // Both exact and partial matches found
           const results = {
             ArticleDetailsbyWord,
           };
           res.status(200).json({
             success: "successfully",
             results,
           }); 
         }
      
       }catch (error) {
     // Respond with a 500 error and an error message
     res.status(500).json(error);
   }
 };

 export const getsubFolderByName = async (req, res) => {
   // Extract the name parameter from the request
   try {
    const { SubFolderName } = req.params;
   //    console.log(MainFolderName)
     // Convert the name to lowercase for a case-insensitive search
     const lowercaseTitle = SubFolderName.toLowerCase();
   //   console.log(lowercaseTitle)
 
   //   const ArticleDetails = await SubFolder.find({ MainmostFolderName: lowercaseTitle });
 
     const ArticleDetailsbyWord = await Video.find({
       SubFolderName: { $regex: new RegExp(lowercaseTitle, "i") },
     });
 console.log(ArticleDetailsbyWord)
   if (ArticleDetailsbyWord.length === 0) {
           // Check if there are no partial matches
           return res.status(400).json(`no sub filders by ${SubFolderName} found`);
   }
       res.status(200).json({
         success: "successfully",
         ArticleDetailsbyWord,
       }); 
   } catch (error) {
     // Respond with a 500 error and an error message
     res.status(500).json(error);
   }
 };


export const getAllVideos = async (req, res) => {
 try {
   // Retrieve all videos from the database
   const allVideos = await Video.find();

   // Respond with the list of videos
   res.status(200).json({ videos: allVideos });
 } catch (error) {
   // Handle errors by responding with the error details
   console.error(error);
   res.status(500).json({ error: "Internal server error" });
 }
};


export const getVideoByTitle = async (req, res) => {
 try {
   const { Videotitle } = req.params;

   if (!Videotitle) {
     return res.status(400).json({ error: "Videotitle parameter is missing" });
   }

   // Find the video by Videotitle
   const foundVideo = await Video.findOne({ Videotitle: { $regex: new RegExp(`^${Videotitle}$`, 'i') } });

   if (!foundVideo) {
     return res.status(404).json({ message: "Video not found" });
   }

   // Respond with the found video
   res.status(200).json({ video: foundVideo });
 } catch (error) {
   // Handle errors by responding with the error details
   console.error(error);
   res.status(500).json({ error: "Internal server error" });
 }
};


export const deleteVideoByTitle = async (req, res) => {
 try {
   const { Videotitle } = req.params;

   if (!Videotitle) {
     return res.status(400).json({ error: "Videotitle parameter is missing" });
   }

   // Find and delete the video by Videotitle
   const deletedVideo = await Video.findOneAndDelete({ Videotitle: { $regex: new RegExp(`^${Videotitle}$`, 'i') } });

   if (!deletedVideo) {
     return res.status(404).json({ message: "Video not found" });
   }

   // Respond with a success message
   res.status(200).json({ success: "Video deleted successfully", deletedVideo });
 } catch (error) {
   // Handle errors by responding with the error details
   console.error(error);
   res.status(500).json({ error: "Internal server error" });
 }
};








 
