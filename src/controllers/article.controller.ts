
// import { Request, Response } from 'express';
// import  Article  from '@/models/article.model';
// import { sanitizeFileName } from '@/utils/SanitizeFileName';
// import { AWS_BUCKET_NAME, AWS_REGION } from '@/config';
// import { PutObjectCommand } from '@aws-sdk/client-s3';
// import { deleteS3File, s3client } from '@/utils/s3service';
// import { v4 as uuidv4 } from 'uuid';

// interface UpdateFields {
//   ArticleTitle?: string;
//   content?: string;
// }

// export const createArticle = async (req: Request, res: Response) => {
//   try {
//     const { ArticleTitle, content } = req.body;
//     const Banner = req.files['Banner'][0];
//     const pdfFile = req.files['pdfFile'][0];

//     if (!ArticleTitle) {
//       return res.status(400).json({ error: 'ArticleTitle required field' });
//     }

//     if (!content) {
//       return res.status(400).json({ error: 'content required field' });
//     }

//     if (!Banner) {
//       return res.status(400).json({ error: 'Banner required file' });
//     }

//     if (!pdfFile) {
//       return res.status(400).json({ error: 'PDF file required' });
//     }

//     const file2Name = Banner.originalname;
//     const BannerName = sanitizeFileName(file2Name);
//     const Bannerkey = `${uuidv4()}-${BannerName}`;

//     const pdfData = pdfFile.buffer;
//     const pdfContentType = pdfFile.mimetype;
//     const pdfOriginalName = pdfFile.originalname;

//     const pdfKey = `${uuidv4()}-${pdfOriginalName}`;

//     try {
//       const bannerParams = {
//         Bucket: AWS_BUCKET_NAME,
//         Key: `uploads/${Bannerkey}`,
//         Body: Banner.buffer,
//         ContentType: Banner.mimetype,
//       };

//       const pdfParams = {
//         Bucket: AWS_BUCKET_NAME,
//         Key: `uploads/${pdfKey}`,
//         Body: pdfData,
//         ContentType: pdfContentType,
//       };

//       const uploadBannerCommand = new PutObjectCommand(bannerParams);
//       await s3client.send(uploadBannerCommand);

//       const uploadPdfCommand = new PutObjectCommand(pdfParams);
//       await s3client.send(uploadPdfCommand);

//       const articleData: Article = {
//         ArticleTitle,
//         content,
//         BannerKey: Bannerkey,
//         Banner_location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${bannerParams.Key}`,
//         pdf: {
//           data: pdfData,
//           contentType: pdfContentType,
//           originalname: pdfOriginalName,
//         },
//         pdfLocation: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${pdfParams.Key}`, // New field for storing the PDF location
//       };

//       const ArticleDetails = await Article.create(articleData);

//       res.status(201).json({
//         ...ArticleDetails.toObject(),
//         pdfLocation: articleData.pdfLocation,
//       });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to create the article' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create the article' });
//   }
// };
import { Request, Response } from 'express';
import Article  from '@/models/article.model';
import { sanitizeFileName } from '@/utils/SanitizeFileName';
import { AWS_BUCKET_NAME, AWS_REGION } from '@/config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { deleteS3File, s3client } from '@/utils/s3service';
import { v4 as uuidv4 } from 'uuid';

interface UpdateFields {
  ArticleTitle?: string;
  content?: string;
}

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { ArticleTitle, content } = req.body;
    const Banner = req.files['Banner'][0];
    const pdfFile = req.files['pdfFile'][0];

    if (!ArticleTitle) {
      return res.status(400).json({ error: 'ArticleTitle required field' });
    }

    if (!content) {
      return res.status(400).json({ error: 'content required field' });
    }

    if (!Banner) {
      return res.status(400).json({ error: 'Banner required file' });
    }

    if (!pdfFile) {
      return res.status(400).json({ error: 'PDF file required' });
    }

    const file2Name = Banner.originalname;
    const BannerName = sanitizeFileName(file2Name);
    const Bannerkey = `${uuidv4()}-${BannerName}`;

    const pdfData = pdfFile.buffer;
    const pdfContentType = pdfFile.mimetype;
    const pdfOriginalName = pdfFile.originalname;

    const pdfKey = `${uuidv4()}-${pdfOriginalName}`;

    try {
      const bannerParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: `uploads/${Bannerkey}`,
        Body: Banner.buffer,
        ContentType: Banner.mimetype,
      };

      const pdfParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: `uploads/${pdfKey}`,
        Body: pdfData,
        ContentType: pdfContentType,
      };

      const uploadBannerCommand = new PutObjectCommand(bannerParams);
      await s3client.send(uploadBannerCommand);

      const uploadPdfCommand = new PutObjectCommand(pdfParams);
      await s3client.send(uploadPdfCommand);

      const articleData: Article = {
        ArticleTitle,
        content,
        BannerKey: Bannerkey,
        Banner_location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${bannerParams.Key}`,
        pdf: {
          data: pdfData,
          contentType: pdfContentType,
          originalname: pdfOriginalName,
        },
        pdfLocation: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${pdfParams.Key}`, // New field for storing the PDF location
      };

      const ArticleDetails = await Article.create(articleData);

      res.status(201).json({
        ...ArticleDetails.toObject(),
        pdfLocation: articleData.pdfLocation,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create the article' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the article' });
  }
};
