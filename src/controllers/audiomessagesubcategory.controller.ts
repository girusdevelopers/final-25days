// audio
// description
// banner

import { AWS_BUCKET_NAME, AWS_REGION } from "@/config";
import Audiofiles from "@/models/audiomessagesubcategory.model";
import { sanitizeFileName } from "@/utils/SanitizeFileName";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { deleteS3File, s3client } from "@/utils/s3service";
import FirstFolder from "@/models/audiomeassage.model";


  export const uploade = async (req, res) => {
    // Extract relevant data from the request body
    const {description, folderName } = req.body;
  
    // Extract music and banner files from the request
    const Music = req.files.Music[0];
    const Banner = req.files.Banner[0];
 
    // Process music details
    const AudioName = req.files.Music[0].originalname;
    const MusicName = sanitizeFileName(AudioName);
    const MusicKey = `${uuidv4()}-${MusicName}`;
  
    // Process banner details
    const file2Name = req.files.Banner[0].originalname;
    const BannerName = sanitizeFileName(file2Name);
    const Bannerkey = `${uuidv4()}-${BannerName}`

    const existingAlbum = await FirstFolder.findOne({
        folderName: { $regex: new RegExp(`^${folderName}$`, 'i') },
      });
    
      if (!existingAlbum) {
        return res.status(404).json({ error: "Folder not found" });
      }

    
    try {
      // Set up parameters for uploading music file to S3
      const params1 = {
        Bucket: AWS_BUCKET_NAME,
        Key: `uploads/${MusicKey}`,
        Body: Music.buffer,
        ContentType: Music.mimetype,
      };
      // Set up parameters for uploading banner file to S3
      const params2 = {
          Bucket: AWS_BUCKET_NAME,
          Key: `uploads/${Bannerkey}`,
          Body: Banner.buffer,
          ContentType: Banner.mimetype,
        };
        
        // Create S3 upload commands for music and banner files
        const command1 = new PutObjectCommand(params1);
        const command2 = new PutObjectCommand(params2);
        
        // Upload music file to S3
        const uploaded1 = await s3client.send(command1);
        
        // Upload banner file to S3
        const uploaded2 = await s3client.send(command2);
        
        // Create a new audio entry in the database
        const audio = await Audiofiles.create({
            Music,
            Banner,
            description,
            MusicKey: MusicKey,
            BannerKey: Bannerkey,
            Audio_location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params1.Key}`,
            Banner_location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params2.Key}`,
        });
  
      // Respond with success message and the created audio entry
      return res.status(201).json({
        success: "song added successfully",
        audio,
      });
    } catch (error) {
      // Handle errors by responding with the error details
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };