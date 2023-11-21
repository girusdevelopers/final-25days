import { search } from "@/controllers/search.controller";
import { Router } from "express";
const router = Router();

router.get("/search/:q", search)

export default router;