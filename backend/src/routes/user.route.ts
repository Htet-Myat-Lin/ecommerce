import { Router } from "express";
import { getUser } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/get-user", protect, getUser)

export default router;