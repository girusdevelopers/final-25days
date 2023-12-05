import express, { RequestHandler } from "express";
import * as uploadVideo from "@controllers/SubFolderVideo/Video.controller";
import { upload } from "@/utils/s3service";
 

const router = express.Router();

// Define routes for article operations
router.post("/videouploads",upload.fields([{ name: "Video", maxCount: 10 },{ name: "Banner", maxCount: 10 },]),uploadVideo.uploadVideo); //upload
// router.get('/getall', Album.getallAlbums); // Get all articles
// // router.get('/:id', Article.getArticleById); // Get a specific article by ID
router.get("/main/:MainFolderName", uploadVideo.getMainFolderByName); //Get a specific article by word
router.get("/sub/:SubFolderName", uploadVideo.getsubFolderByName); //Get a specific article by word
  
export default router;
