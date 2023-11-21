import { Router } from 'express';
import * as message from '@/controllers/message.controller';
import { upload } from '@/utils/s3service';

const router = Router();


router.post("/upload",upload.single('Banner'),message.createMessage)

router.get("/getall",message.getall)

router.put("/update/:id",message.UpdateMessage)

router.delete('/delete/:id',message.deleteMessageById);

router.get("/findbytitle/:title", message.findbytitle)

router.get("/:name", message.getMessageByName)


export default router;