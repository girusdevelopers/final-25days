import { AWS_BUCKET_NAME, AWS_REGION, BASE_URL } from "@/config";
import VideoMainFolder from "@/models/SubFolderVideo/MainFolder.model";
import VideoSubFolder from "@/models/SubFolderVideo/SubFolder.model";
import { sanitizeFileName } from "@/utils/SanitizeFileName";
import { s3client } from "@/utils/s3service";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
  

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
  
//     const existingSub = await VideoSubFolder.findOne({
//         SubFolderName
//         : { $regex: new RegExp(`^${SubFolderName}$`, 'i') },
//     });

//     const existingMain = await VideoMainFolder.findOne({
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
//         const ArticleDetails = await VideoSubFolder.create({
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

    const existingMain = await VideoMainFolder.findOne({
      MainmostFolderName: { $regex: new RegExp(`^${MainmostFolderName}$`, 'i') },
    });

    if (!existingMain) {
      return res.status(400).json({ message: `${MainmostFolderName} doesn't exist; please create a main folder` });
    }

    // Check for the existence of a subfolder with the same name within the specified main folder
    const existingSub = await VideoSubFolder.findOne({
      MainmostFolder: existingMain._id,
      SubFolderName: { $regex: new RegExp(`^${SubFolderName}$`, 'i') },
  });

    if (existingSub) {
      return res.status(400).json({ message: `${SubFolderName} already exists in ${MainmostFolderName}; please change the name` });
    }

    const ArticleDetails = await VideoSubFolder.create({
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

  export const getMainFolderinsubFolderByName = async (req, res) => {
    // Extract the name parameter from the request
    try {
     const { MainFolderName } = req.params;
    //    console.log(MainFolderName)
      // Convert the name to lowercase for a case-insensitive search
      const lowercaseTitle = MainFolderName.toLowerCase();
  
  
    //   const ArticleDetails = await SubFolder.find({ MainmostFolderName: lowercaseTitle });
  
      const ArticleDetailsbyWord = await VideoMainFolder.find({
        MainmostFolderName: { $regex: new RegExp(lowercaseTitle, "i") },
      });
  
    if (ArticleDetailsbyWord.length === 0) {
            // Check if there are no partial matches
            return res.status(400).json(`no sub filders by ${MainFolderName} found`);
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



  export const getallsubfolders = async (req, res) => {
    try {
      const getallsubfolders = await VideoSubFolder.find(); // Retrieve all audio details from the database
  
      return res.status(200).json({
        success: "Fetched all SubFolders",
        getallsubfolders,
      });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving SubFolder details." });
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
  
      const subfolders = await VideoSubFolder.find({
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

  
  export const deleteSubFolder = async (req, res) => {
    const { SubFolderName } = req.params;
  
    try {
      // Find the SubFolder by SubFolderName
      const existingSubFolder = await VideoSubFolder.findOne({
        SubFolderName: {
          $regex: new RegExp(`^${SubFolderName}$`, 'i'),
        },
      });
  
      if (!existingSubFolder) {
        return res.status(404).json({ message: "SubFolder not found" });
      }
  
      // Delete the SubFolder from the database
      await VideoSubFolder.deleteOne({ SubFolderName });
  
      // Delete the SubFolder's banner from S3
      const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: `uploads/${existingSubFolder.SubFolderkey}`,
      };
  
      const deleteCommand = new DeleteObjectCommand(params);
      await s3client.send(deleteCommand);
  
      res.status(200).json({ message: "SubFolder deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  