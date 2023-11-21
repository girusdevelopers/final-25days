import express from 'express';
import * as Album from '@controllers/album.controller'; // Import your controller functions
import { upload } from '@/utils/s3service';

const router = express.Router();

// Define routes for article operations
router.post('/createalbum',upload.single('AblumBanner'), Album.createAlbum); // Create a new article
// router.get('/getall', Article.getArticles); // Get all articles
// router.get('/:id', Article.getArticleById); // Get a specific article by ID
// router.get('/article/:name',Article.getArticleByName);//Get a specific article by word
// router.put('/updateArticle/:id', Article.updateArticle); // Update an article by ID
// // router.delete('/articles/:id', Article.deleteArticle); // Delete an article by ID

// router.delete('/delete/:id', Article.deleteArticleById);//deleteById


export default router;
