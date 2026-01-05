import { AppError } from "../utils/app.error.js";
import { asyncHandler } from "../utils/async.handler.js";
import { ProductService } from "../services/product.service.js";
import { ReviewService } from "../services/review.service.js";

export const createReview= asyncHandler(async(req, res, next) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user!._id;

  // Check if product exists
  const product = await ProductService.getProductById(productId)
  if (!product) throw new AppError("Product not found", 404)

  const existingReview = await ReviewService.checkExistingReview(userId as unknown as string, productId as unknown as string)
  if (existingReview) throw new AppError("You already reviewed this product", 400)

  const review = await ReviewService.createReview({ user: userId.toString(), product: productId, rating, comment })
  res.status(201).json({ success: true, review, message: "Review created successfully" });
})

export const getProductReviews = asyncHandler(async(req, res, next) => {
  const { productId } = req.params
  const reviews = await ReviewService.getProductReviews(productId as unknown as string)
  res.status(200).json({ success: true, reviews, message: "Product review fetched successfully" })
})

export const updateReview = asyncHandler(async(req, res, next) => {
  const { reviewId, productId } = req.params
  const userId = req.user?._id

  const existingReview = await ReviewService.checkExistingReview(userId as unknown as string, productId as unknown as string)
  if(!existingReview) throw new AppError("You can't update other user's review.", 400)

  const review = await ReviewService.updateReview(reviewId as unknown as string, userId as unknown as string, req.body)
  res.status(200).json({ success: true, review, message: "Review updated successfully" })
})

export const deleteReview = asyncHandler(async(req, res, next) => {
  const { reviewId, productId } = req.params
  const userId = req.user?._id

  const existingReview = await ReviewService.checkExistingReview(userId as unknown as string, productId as unknown as string)
  if(!existingReview) throw new AppError("You can't delete other user's review.", 400)

  await ReviewService.deleteReview(reviewId as unknown as string, userId as unknown as string)
  res.status(200).json({ success: true, message: "Review deleted successfully" })
})

export const getUserReviews = asyncHandler(async(req, res, next) => {
  const userId = req.user?._id
  const reviews = await ReviewService.getUserReviews(userId as unknown as string)
  res.status(200).json({ success: true, reviews, message: "User's reviews fetched successfully" })
})

export const checkExistingReview = asyncHandler(async(req, res, next) => {
  const userId = req.user?._id
  const { productId } = req.params

  const existingReview = await ReviewService.checkExistingReview(userId as unknown as string, productId as unknown as string)
  res.status(200).json({ success: true, hasExistingReview: existingReview })
})