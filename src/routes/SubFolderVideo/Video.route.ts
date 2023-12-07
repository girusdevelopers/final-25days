// import express, { RequestHandler } from "express";
// import * as uploadVideo from "@controllers/SubFolderVideo/Video.controller";
// import { upload } from "@/utils/s3service";
 

// const router = express.Router();

// // Define routes for article operations
// router.post("/upload",uploadVideo.uploadVideo); //upload
// // router.get('/getall', Album.getallAlbums); // Get all articles
// // // router.get('/:id', Article.getArticleById); // Get a specific article by ID
// router.get("/main/:MainFolderName", uploadVideo.getMainFolderByName); //Get a specific article by word
// router.get("/sub/:SubFolderName", uploadVideo.getsubFolderByName); //Get a specific article by word
  
// export default router;

import express, { RequestHandler } from "express";
import * as uploadVideo from "@controllers/SubFolderVideo/Video.controller";
import { upload } from "@/utils/s3service";
 

const router = express.Router();
 
router.post("/upload",uploadVideo.uploadVideo);  
 router.get("/main/:MainFolderName", uploadVideo.getMainFolderByName);  
router.get("/sub/:SubFolderName", uploadVideo.getsubFolderByName);  
router.get("/getAllVideos",uploadVideo.getAllVideos);
router.get("/getVideoByTitle/:Videotitle", uploadVideo.getVideoByTitle);
router.delete("/deleteVideoByTitle/:Videotitle", uploadVideo.deleteVideoByTitle);


export default router;

