import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { deleteNotification, getUserNotifications, markAllAsRead, markAsRead } from "../controllers/notification.controller.js";

const router = Router();

router.use(protect);

router.get("/",getUserNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/:id", deleteNotification);

export default router;
