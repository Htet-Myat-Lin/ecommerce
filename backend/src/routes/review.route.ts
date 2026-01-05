import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { checkExistingReview, createReview, deleteReview, getProductReviews, getUserReviews, updateReview } from "../controllers/review.controller.js";

const router = Router();

router.get("/product/:productId", getProductReviews);

router.use(protect);

router.post("/", createReview);

router.get("/my-reviews", getUserReviews);

router.patch("/:reviewId/product/:productId", updateReview);

router.delete("/:reviewId/product/:productId", deleteReview);

router.get("/product/:productId/reviews/mine", checkExistingReview)

export default router;
