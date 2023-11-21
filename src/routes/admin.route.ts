import { Router } from "express";
import  * as admin from "@/controllers/admin.controller";
const router = Router();


router.post("/admin/login",  admin.Adminlogin);

router.post("/admin/logout",  admin.AdminlogOut);

router.put("/admin/:email",  admin.edit);


export default router;