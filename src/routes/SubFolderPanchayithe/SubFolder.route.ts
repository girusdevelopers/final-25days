import express from 'express';
import * as SubFolder from '@controllers/SubFolderPanchayithe/SubFolder.controller'
import { upload } from '@/utils/s3service';

const router = express.Router();

// Define routes for article operations
router.post('/create',upload.single('SubFolderBanner'), SubFolder.createSubFolder); 
router.get('/main/:MainFolderName',SubFolder.getMainFolderinsubFolderByName);// Create a new article
router.get('/sub/:SubFolderName',SubFolder.getsubFolderByName);// Create a new article
router.get('/getall',SubFolder.getallsongs); // Get all articles
// // router.get('/:id', Article.getArticleById); // Get a specific article by ID
// router.get('/:name',Album.getAlbumByName);//Get a specific article by word
// router.put('/Update/a:id', Album.UpdateAlbumTitle); // Update an article by ID
// router.delete('/delete/:id', Album.deleteAlbumById); // Delete an article by ID

router.delete('/delete/:id', SubFolder.deleteSubFolder);//deleteById
// Add this route to handle getting a SubFolder by ID
router.get('/sub-folder/:id',SubFolder.getSubFolderById);



export default router;
