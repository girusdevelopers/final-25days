import express from 'express';
import * as ArticleController from '@controllers/article.controller'; // Import your controller functions
import { upload } from '@/utils/s3service';

const router = express.Router();

// Define routes for article operations
router.post('/uploadarticles', upload.fields([{ name: 'Banner', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), ArticleController.createArticle); // Create a new article
// Add other routes as needed

export default router;
