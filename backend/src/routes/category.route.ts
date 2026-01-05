import { Router } from "express";
import { protect, requireEmailVerified, restrictTo } from "../middleware/auth.js";
import { 
  createCategory, 
  getCategories,
  updateCategory, 
  deleteCategory 
} from "../controllers/category.controller.js";

const router = Router();

router.route("/")
  .get(getCategories)
  .post(protect, requireEmailVerified, restrictTo("admin"), createCategory);

router.route("/:id")
  .patch(protect, requireEmailVerified, restrictTo("admin"), updateCategory)
  .delete(protect, requireEmailVerified, restrictTo("admin"), deleteCategory);

export default router;
