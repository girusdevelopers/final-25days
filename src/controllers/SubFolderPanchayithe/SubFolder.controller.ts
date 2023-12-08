import { AWS_BUCKET_NAME, AWS_REGION, BASE_URL } from "@/config";
import MainFolder from "@/models/SubFolderPanchayithe/MainFolder.model";
import SubFolder from "@/models/SubFolderPanchayithe/SubFolder.model";
import { sanitizeFileName } from "@/utils/SanitizeFileName";
import { deleteS3File, s3client } from "@/utils/s3service";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";



// export const createSubFolder = async (req, res) => {
//     const { SubFolderName,MainmostFolderName } = req.body;
//     const SubFolderBanner = req.file;

//     if (!SubFolderName) {
//       return res.status(400).json({ error: "SubFolderName required field" });
//     }

//     if (!MainmostFolderName) {
//       return res.status(400).json({ error: "MainmostFolderName required field" });
//     }

//     if (!SubFolderBanner) {
//       return res.status(400).json({ error: "SubFolderBanner required file" });
//     }
  
//     // console.log(AblumBanner)
//     const file2Name = SubFolderBanner.originalname;
    
//     const BannerName = sanitizeFileName(file2Name);
//     console.log(BannerName)
//     const Bannerkey = `${uuidv4()}-${BannerName}`
//     console.log(Bannerkey)
//     // Upload the image to S3 bucket
//     try {
//     const params = {
//       Bucket: AWS_BUCKET_NAME,
//       Key: `uploads/${Bannerkey}`,
//       Body: SubFolderBanner.buffer,
//       ContentType: SubFolderBanner.mimetype,
//     };
//   // Execute S3 upload command  
//     const command1 = new PutObjectCommand(params);
//     const uploaded1 = await s3client.send(command1);
  
//     const existingSub = await SubFolder.findOne({
//         SubFolderName
//         : { $regex: new RegExp(`^${SubFolderName}$`, 'i') },
//     });

//     const existingMain = await MainFolder.findOne({
//         MainmostFolderName
//         : { $regex: new RegExp(`^${MainmostFolderName}$`, 'i') },
//     });
//     // console.log(existingMain)
  
//       if (!existingMain) {
//         return res.status(400).json({ message:`${MainmostFolderName} doesnt exist please create a main folder`});
//       }

//       if(existingSub){
//         return res.status(400).json({ message:`${SubFolderName} already exits please cahnge the name`});
//       }

//       if(!existingSub && existingMain){
//         const ArticleDetails = await SubFolder.create({
//             SubFolderName,
//             MainmostFolderName,
//             SubFolderkey: Bannerkey,
//             SubFolder_banner: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`,
//           });
//        // Respond with the created article details   
//           res.status(201).json(ArticleDetails);
//       }
//   // Create a new article with the uploaded banner details  
     
//     } catch (error) {
//    // Handle errors during article creation/upload   
//       res.status(500).json(error);
//     }
//   };

export const createSubFolder = async (req, res) => {
  const { SubFolderName, MainmostFolderName } = req.body;
  const SubFolderBanner = req.file;

  if (!SubFolderName) {
    return res.status(400).json({ error: "SubFolderName required field" });
  }

  if (!MainmostFolderName) {
    return res.status(400).json({ error: "MainmostFolderName required field" });
  }

 

  const file2Name = SubFolderBanner.originalname;
  const BannerName = sanitizeFileName(file2Name);
  const Bannerkey = `${uuidv4()}-${BannerName}`;

  try {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: `uploads/${Bannerkey}`,
      Body: SubFolderBanner.buffer,
      ContentType: SubFolderBanner.mimetype,
    };

    const command1 = new PutObjectCommand(params);
    await s3client.send(command1);

    const existingMain = await MainFolder.findOne({
      MainmostFolderName: { $regex: new RegExp(`^${MainmostFolderName}$`, 'i') },
    });

    if (!existingMain) {
      return res.status(400).json({ message: `${MainmostFolderName} doesn't exist; please create a main folder` });
    }

    // Check for the existence of a subfolder with the same name within the specified main folder
    const existingSub = await SubFolder.findOne({
      MainmostFolder: existingMain._id,
      SubFolderName: { $regex: new RegExp(`^${SubFolderName}$`, 'i') },
  });

    if (existingSub) {
      return res.status(400).json({ message: `${SubFolderName} already exists in ${MainmostFolderName}; please change the name` });
    }

    const ArticleDetails = await SubFolder.create({
      SubFolderName,
      MainmostFolderName,
      MainmostFolder: existingMain._id,
      SubFolderkey: Bannerkey,
      audiomessagessubfolder:`${BASE_URL}/v1/audiomessage/sub/${SubFolderName}`,
      SubFolder_banner: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`,
    });

    res.status(201).json(ArticleDetails);
  } catch (error) {
    res.status(500).json(error);
  }
};
  


// Controller to create a subfolder
// exports.createSubFolder = async (req, res) => {
//     // Extract relevant data from the request body
//     const { SubFolderName, MainmostFolderName } = req.body;

//     // Validation: Ensure required fields are provided
//     if (!SubFolderName || !MainmostFolderName) {
//         return res.status(400).json({ error: "Please provide SubFolderName and MainmostFolderName" });
//     }

//     try {
//         // Check if the main folder exists
//         const existingMain = await MainFolder.findOne({
//             MainmostFolderName: { $regex: new RegExp(`^${MainmostFolderName}$`, 'i') },
//         });

//         if (!existingMain) {
//             return res.status(500).json({ message: "Main folder does not exist" });
//         }

//         // Check if the subfolder already exists within the main folder
//         const existingSub = await SubFolder.findOne({
//             MainmostFolder: existingMain._id,
//             SubFolderName: { $regex: new RegExp(`^${SubFolderName}$`, 'i') },
//         });

//         if (existingSub) {
//             return res.status(500).json({ message: "Subfolder already exists within the specified main folder" });
//         }

//         // Create the subfolder
//         const subfolder = await SubFolder.create({
//             SubFolderName,
//             MainmostFolder: existingMain._id,
//             MainmostFolderName: MainmostFolderName, // Save the MainmostFolderName in the subfolder
//             // Add other fields as needed
//         });

//         // Respond with success message and the created subfolder entry
//         return res.status(201).json({
//             success: "Subfolder created successfully",
//             subfolder,
//         });
//     } catch (error) {
//         // Handle errors by responding with the error details
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// };


  export const getMainFolderinsubFolderByName = async (req, res) => {
    // Extract the name parameter from the request
    try {
     const { MainFolderName } = req.params;
    //    console.log(MainFolderName)
      // Convert the name to lowercase for a case-insensitive search
      const lowercaseTitle = MainFolderName.toLowerCase();
  
  
    //   const ArticleDetails = await SubFolder.find({ MainmostFolderName: lowercaseTitle });
  
      const Mainfolders = await SubFolder.find({
        MainmostFolderName: lowercaseTitle,
      });
  
    if (Mainfolders.length === 0) {
            // Check if there are no partial matches
            return res.status(400).json(`no sub filders by ${MainFolderName} found`);
    }
        res.status(200).json({
          success: "successfully",
          Mainfolders,
        }); 
    } catch (error) {
      // Respond with a 500 error and an error message
      res.status(500).json(error);
    }
  };



  export const getallsongs = async (req, res) => {
    try {
      const allsubfolders = await SubFolder.find(); // Retrieve all audio details from the database
  
      return res.status(200).json({
        success: "Fetched all songs",
        allsubfolders,
      });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving audio details." });
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
  
      const subfolders = await SubFolder.find({
        SubFolderName:lowercaseTitle,
      });
  // console.log(ArticleDetailsbyWord)
    if (subfolders.length === 0) {
            // Check if there are no partial matches
            return res.status(400).json(`no sub filders by ${SubFolderName} found`);
    }
        res.status(200).json({
          success: "successfully",
          subfolders,
        }); 
    } catch (error) {
      // Respond with a 500 error and an error message
      res.status(500).json(error);
    }
  };

  export const getSubFolderById = async (req,res) => {
    const { id } = req.params;
  
    try {
      // Find a SubFolder by ID
      const subFolder = await SubFolder.findById(id);
  
      if (!subFolder) {
        return res.status(404).json({ error: "SubFolder not found" });
      }
  
      // Do not include sensitive information like the folder key in the response
      const {
        SubFolderName,
        MainmostFolderName,
        SubFolder_banner,
      } = subFolder.toObject();
  
      res.status(200).json({
        id,
        SubFolderName,
        MainmostFolderName,
        SubFolder_banner,
      });
    } catch (error) {
      // Handle any errors that occurred during the retrieval process
      console.error(error);
      res.status(500).json(error);
    }
  };


  export const deleteSubFolder = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the details of the song before deletion
      const deletedAlbum = await SubFolder.findById(id);
      // console.log(deletedAlbum);
      if (!deletedAlbum) {
        return res.status(404).json({ error: "sub folder not found" });
      }
      // Delete the associated files from S3
      // await deleteS3File(deletedSong.MusicKey);
      await deleteS3File(deletedAlbum.SubFolderkey);
  
      // Delete the song from the database
      const deleteAlbum = await SubFolder.deleteOne({ _id: id });
  // Check if the deletion was successful (deletedCount === 1)
      if (deleteAlbum.deletedCount === 1) {
         // If successful, respond with a success message
        return res.status(200).json({
          success: `folder '${deletedAlbum.SubFolderName}' and associated files deleted successfully`,
        });
      } else {
        // If deletion was not successful, respond with a 500 error
        return res.status(500).json({ error: "Error deleting main folder" });
      }
    } catch (error) {
      // Handle any errors that occurred during the deletion process
      return res.status(500).json(error);
    }
  };