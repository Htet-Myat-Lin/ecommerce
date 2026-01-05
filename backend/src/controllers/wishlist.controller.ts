import { type AuthRequest } from "../utils/types.js";
import { AppError } from "../utils/app.error.js";
import { asyncHandler } from "../utils/async.handler.js";
import { WishlistService } from "../services/wishlist.service.js";

export const getWishlists = asyncHandler(async(req, res, next) => {
  const userId = req.user?._id
  if(!userId) throw new AppError("Unauthorized", 401)
  const wishlists = await WishlistService.getWishlists(userId as unknown as string)
  res.status(200).json({ success: true, wishlists })
})

export const addToWishlist = asyncHandler(async(req, res, next) => {
  const userId = req.user?._id
  const { productId } = req.params
  if(!userId || !productId) throw new AppError("User and Product IDs are required", 400)
  const wishlist = await WishlistService.addToWishlist(userId as unknown as string, productId)
  res.status(200).json({ success: true, wishlist, message: "Product added to wishlist" })
})

export const removeFromWishlist = asyncHandler(async(req, res, next) => {
  const userId = req.user?._id
  const { productId } = req.params 
  if(!userId || !productId) throw new AppError("User and Product IDs are required", 400)
  const wishlist = await WishlistService.removeFromWishlist(userId as unknown as string, productId)
  res.status(200).json({ success: true, wishlist, message: "Product removed from wishlist" })
})

export const clearWishlist = asyncHandler(async(req, res, next) => {
  const userId = req.user?._id
  if(!userId) throw new AppError("Unauthorized", 401)
  await WishlistService.clearWishlist(userId as unknown as string)
  res.status(200).json({ success: true, message: "Wishlist cleared" })
})

export const isInWishlist = asyncHandler(async(req, res, next) => {
  const userId = req.user?._id
  const { productId } = req.params
  if(!userId || !productId) throw new AppError("User and Product IDs are required", 400)
  const isInWishlist = await WishlistService.isInWishlist(userId as unknown as string, productId)
  res.status(200).json({ success: true, isInWishlist })
})