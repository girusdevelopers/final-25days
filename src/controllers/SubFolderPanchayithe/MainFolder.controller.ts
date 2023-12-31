import { AWS_BUCKET_NAME, AWS_REGION, BASE_URL } from "@/config";
import MainFolder from "@/models/SubFolderPanchayithe/MainFolder.model";

import { sanitizeFileName } from "@/utils/SanitizeFileName";
import { deleteS3File, s3client } from "@/utils/s3service";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";




export const createMainFolder = async (req, res) => {
    const { MainmostFolderName } = req.body;
    const MainFolderBanner = req.file;

    if (!MainmostFolderName) {
      return res.status(400).json({ error: "MainmostFolderName required field" });
    }

    if (!MainFolderBanner) {
      return res.status(400).json({ error: "MainFolderBanner required file" });
    }
  
    // console.log(AblumBanner)
    const file2Name = MainFolderBanner.originalname;
    
    const BannerName = sanitizeFileName(file2Name);
    // console.log(BannerName)
    const Bannerkey = `${uuidv4()}-${BannerName}`
    // console.log(Bannerkey)
    // Upload the image to S3 bucket
    try {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: `uploads/${Bannerkey}`,
      Body: MainFolderBanner.buffer,
      ContentType: MainFolderBanner.mimetype,
    };
  // Execute S3 upload command  
    const command1 = new PutObjectCommand(params);
    const uploaded1 = await s3client.send(command1);
  
    const existingAlbum = await MainFolder.findOne({
      MainmostFolderName
        : { $regex: new RegExp(`^${MainmostFolderName}$`, 'i') },
    });
  
      if (existingAlbum) {
        return res.status(400).json({ message:"this folder name already exists please change folder name"});
      }
  // Create a new article with the uploaded banner details  
      const MainFolderDetails = await MainFolder.create({
        MainmostFolderName,
        SubfolderinMainfolder:`${BASE_URL}/v1/subfolder/main/${MainmostFolderName}`,
        MainmostFolderNamekey: Bannerkey,
        MainmostFolderName_banner: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`,
      });
   // Respond with the created article details   
      res.status(201).json(MainFolderDetails);
    } catch (error) {
   // Handle errors during article creation/upload   
      res.status(500).json(error);
    }
  };


  export const getMainFolderByName = async (req, res) => {
    // Extract the name parameter from the request
    try {
     const { MainFolderName } = req.params;
      //  console.log(MainFolderName)
      // Convert the name to lowercase for a case-insensitive search
      const lowercaseTitle = MainFolderName.toLowerCase();
  
  
      // const ArticleDetails = await MainFolder.find({ MainFolderName: lowercaseTitle });
  
      const MainFolders = await MainFolder.find({
        MainmostFolderName: { $regex: new RegExp(lowercaseTitle, "i") },
      });
      if (MainFolders.length === 0) {
            // Check if there are no partial matches
            return res.status(200).json("not found");
          } else {
            // Both exact and partial matches found
            const results = {
              MainFolders,
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

  export const getallsongs = async (req, res) => {
    try {
      const getallmainfolders = await MainFolder.find(); // Retrieve all audio details from the database
  
      return res.status(200).json({
        success: "Fetched all mainfolders",
        getallmainfolders,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
  export const getMainFolderById = async (req,res) => {
    const { id } = req.params;
  
    try {
      // Find a Main Folder by ID
      const mainFolder = await MainFolder.findById(id);
  
      if (!mainFolder) {
        return res.status(404).json({ error: "Main Folder not found" });
      }
  
      // Do not include sensitive information like the folder key in the response
      const {
        MainmostFolderName,
        SubfolderinMainfolder,
        MainmostFolderName_banner,
      } = mainFolder.toObject();
  
      res.status(200).json({
        id,
        MainmostFolderName,
        SubfolderinMainfolder,
        MainmostFolderName_banner,
      });
    } catch (error) {
      // Handle any errors that occurred during the retrieval process
      console.error(error);
      res.status(500).json({ error: "Error retrieving Main Folder details" });
    }
  };


  export const deleteMainFolder = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the details of the song before deletion
      const deletedAlbum = await MainFolder.findById(id);
      // console.log(deletedAlbum);
      if (!deletedAlbum) {
        return res.status(404).json({ error: "Album not found" });
      }
      // Delete the associated files from S3
      // await deleteS3File(deletedSong.MusicKey);
      await deleteS3File(deletedAlbum.MainmostFolderNamekey);
  
      // Delete the song from the database
      const deleteAlbum = await MainFolder.deleteOne({ _id: id });
  // Check if the deletion was successful (deletedCount === 1)
      if (deleteAlbum.deletedCount === 1) {
         // If successful, respond with a success message
        return res.status(200).json({
          success: `folder '${deletedAlbum.MainmostFolderName}' and associated files deleted successfully`,
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