import { AWS_BUCKET_NAME, AWS_REGION } from "@/config";
import FirstFolder from "@/models/audiomeassage.model";
import { sanitizeFileName } from "@/utils/SanitizeFileName";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";


export const uploade = async (req,res) =>{
  const {folderName, description } = req.body;
  const Banner = req.files.Banner[0];
  console.log("banner:",Banner);
  console.log(folderName);

  const existingFolder = await FirstFolder.findOne({
    folderName: { $regex: new RegExp(`^${folderName}$`, 'i') },
  });

    if (existingFolder) {
      return res.status(400).json({ message:"this Folder name already exists please change Folder name"});
    }

  const file2Name = Banner.originalname;
    console.log(file2Name)
  const BannerName = sanitizeFileName(file2Name);
  
  const Bannerkey = `${uuidv4()}-${BannerName}`
  console.log(Bannerkey)

  try{
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: `uploads/${Bannerkey}`,
      Body: Banner.buffer,
      ContentType: Banner.mimetype,
      };

      // Create a new command to upload the banner file to S3
    const command = new PutObjectCommand(params);

    const banner = await FirstFolder.create({
      folderName : folderName ,
      description : description,
      bannerKey:params.Key,
      Banner_location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`,
    });
// Respond with a success status and the created banner details
    return res.status(200).json({
    message:"banner uploaded sucessfully",
    banner
  });

  }catch(error){
    res.status(500).json("error")
  }
}


export const allfolders = async (req, res) => {
  try {
    // Retrieve all banner entries from the database
    const folders = await FirstFolder.find({});
// Respond with a success status and the retrieved banners
    res.status(200).json(folders);
  } catch (error) {
    // Handle errors during banner retrieval
    res.status(400).json("Folder not found");
  }
};

export const getFolderByName = async (req,res) =>{
   // Extract the name parameter from the request
   const { name } = req.params;

   // Convert the name to lowercase for a case-insensitive search
   const lowercaseTitle = name.toLowerCase();
 
   try {
     // Find audio details with an exact match to the lowercase title
     const folderDetails = await FirstFolder.find({ folderName: lowercaseTitle });
 
     // Find audio details with a case-insensitive partial match to the lowercase title
     const folderDetailsbyWord = await FirstFolder.find({
      folderName: { $regex: new RegExp(lowercaseTitle, "i") },
     });
 
     // Check if there are no exact matches
     if (folderDetails.length === 0) {
       return res.status(200).json(folderDetailsbyWord);
     } else if (folderDetailsbyWord.length === 0) {
       // Check if there are no partial matches
       return res.status(200).json(folderDetailsbyWord);
     } else {
       // Both exact and partial matches found
       const results = {
        folderDetails,
        folderDetailsbyWord,
       };
       res.status(200).json(results);
     }
   } catch (error) {
     // Respond with a 500 error and an error message
     res.status(500).json({ error: "Error retrieving Folder details" });
   }
}


export const updateFolderDetails = async (req, res) => {
  // Destructure relevant fields from the request body
  const { folderName, description } = req.body;

  // Extract audio ID from the route parameters
  const audioId = req.params.id; // Assuming you pass the audio ID in the route URL

  try {
    // Create an object to store fields to be updated
    const updateFields: UpdateFields = {};

    // Check if each field is provided in the request body and add it to updateFields
    if (Musictitle) updateFields.Musictitle = Musictitle;
    if (artist) updateFields.artist = artist;
    if (description) updateFields.description = description;
    if (lyrics) updateFields.lyrics = lyrics;

    // Find and update the audio details in the database
    const audio = await Audio.findByIdAndUpdate(
      { _id: audioId },
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
