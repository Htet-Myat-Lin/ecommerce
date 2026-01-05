import { Router } from "express";
import { protect, requireEmailVerified, restrictTo } from "../middleware/auth.js";
import { addToWishlist, clearWishlist, getWishlists, isInWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";

const router = Router();

router.use(protect, requireEmailVerified, restrictTo("user", "admin"));

router.get("/", getWishlists);

router.patch("/:productId/add", addToWishlist);

router.patch("/:productId/remove", removeFromWishlist);

router.delete("/clear", clearWishlist);

router.get("/check/:productId", isInWishlist);

export default router;
