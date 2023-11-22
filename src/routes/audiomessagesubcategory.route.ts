import { Router } from "express";
import * as Audio from "@/controllers/audiomessagesubcategory.controller"
import { upload } from "@/utils/s3service";
const router = Router();


router.post("/Audioupload", upload.fields([ { name: 'Banner', maxCount: 1 }, { name: 'Music', maxCount: 1 }]), Audio.uploade);//upload

// router.put('/:folderName', Audio.updateFolderDetails);//update

// router.get('/getalls', Audio.allfolder)

// router.get('/getall', Audio.allfolders);//getall
//  localhost:8080/v1/Audio/getall?page=1&limit=1

// router.delete('/delete/:folderName', Audio.deletefolderNameByName);//deleteByFolderName

// router.get('/:name', Audio.getFolderByName);//getByFolderName

export default router;