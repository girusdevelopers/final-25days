import { deleteS3File, s3client } from "@/utils/s3service";
import { AWS_BUCKET_NAME, AWS_REGION} from "@/config";
import Banner from "@/models/banner.model";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { sanitizeFileName } from "@/utils/SanitizeFileName";
import { v4 as uuidv4 } from "uuid";

// app.use(multer().array("song"));

export const bannerupload = async (req, res) => {
   const file = req.file;
   const file2Name = file.originalname;
    console.log(file2Name)
  const BannerName = sanitizeFileName(file2Name);
  
  const Bannerkey = `${uuidv4()}-${BannerName}`
  console.log(Bannerkey)

  try {
   // Prepare S3 upload parameters for the banner file 

    const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: `uploads/${Bannerkey}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    };

// Create a new command to upload the banner file to S3
    const command = new PutObjectCommand(params);
  // Execute the S3 upload command   
    const uploaded = await s3client.send(command);
    // Log S3 upload parameters to the console
    // console.log(params);
// Create a new banner entry in the database with the uploaded banner file location
    const banner = await Banner.create({
      bannerKey:params.Key,
      Banner_location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`,
    });
// Respond with a success status and the created banner details
    return res.status(200).json({
    message:"banner uploaded sucessfully",
    banner
  });
  } catch (error) {
    // Handle errors during banner upload
    return res.status(400).json({ error: "Details not uploaded." });
  }
};

export const allbanners = async (req, res) => {
  try {
    // Retrieve all banner entries from the database
    const banners = await Banner.find({});
// Respond with a success status and the retrieved banners
    res.status(200).json(banners);
  } catch (error) {
    // Handle errors during banner retrieval
    res.status(400).json("not found");
  }
};
export function Banner(arg0: string, deletebanner: any) {
    throw new Error('Function not implemented.');
}

export const deletebanner = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the details of the song before deletion
    const deletedSong = await Banner.findById(id);
    console.log(deletedSong);
    if (!deletedSong) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Delete the associated files from S3
    // await deleteS3File(deletedSong.MusicKey);
    await deleteS3File(deletedSong.bannerKey);

    // Delete the song from the database
    const deleteArticle = await Banner.deleteOne({ _id: id });
// Check if the deletion was successful (deletedCount === 1)

       // If successful, respond with a success message
      return res.status(200).json({
        success: `Banner deleted successfully`,
      });

  } catch (error) {
    // Handle any errors that occurred during the deletion process
    return res.status(500).json({ error: "Error deleting audio details" });
  }
};
