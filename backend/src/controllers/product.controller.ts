import type { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/product.service.js";
import { asyncHandler } from "../utils/async.handler.js";
import fs from "node:fs";
import { AppError } from "../utils/app.error.js";
import type { ProductFilters } from "../utils/types.js";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as Express.Multer.File[];
  try {
    if (typeof req.body.variants === "string") {
      req.body.variants = JSON.parse(req.body.variants);
    }
    if (typeof req.body.specifications === "string") {
      req.body.specifications = JSON.parse(req.body.specifications);
    }
    const images = files.map((file) => file.filename);
    const product = await ProductService.createProduct({ ...req.body, images });
    return res.status(201).json({ success: true, product });
  } catch (err) {
    // delete uploaded files when validation error occured
    if (files.length) {
      files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlink(file.path, () => {});
        }
      });
    }
    next(err);
  }
};

export const getProducts = asyncHandler(async (req, res, next) => {
  // Parse query parameters
  const filters: ProductFilters = {};
  
  // Handle array parameters (categoryIds, brand)
  if (req.query.categoryIds) {
    filters.categoryIds = Array.isArray(req.query.categoryIds) 
      ? req.query.categoryIds as string[]
      : [req.query.categoryIds as string];
  }
  
  if (req.query.brand) {
    filters.brand = Array.isArray(req.query.brand)
      ? req.query.brand as string[]
      : [req.query.brand as string];
  }
  
  // Handle priceRange (JSON string)
  if (req.query.priceRange) {
    try {
      filters.priceRange = typeof req.query.priceRange === 'string'
        ? JSON.parse(req.query.priceRange)
        : req.query.priceRange as unknown as { min: number; max: number };
    } catch (e) {

    }
  }
  
  // Handle simple parameters
  if (req.query.search) filters.search = req.query.search as string;
  if (req.query.sortBy) filters.sortBy = req.query.sortBy as string;
  if (req.query.page) filters.page = Number(req.query.page) || 1;
  if (req.query.limit) filters.limit = Number(req.query.limit) || 10;
  
  const { products, totalPages } = await ProductService.getProducts(filters);
  return res.status(200).json({ success: true, products, totalPages });
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductService.getProductById(id as string);
  if (!product) throw new AppError("Product not found", 404);
  return res.status(200).json({ success: true, product });
});

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const files = (req.files as Express.Multer.File[]) || [];

  try {
    const product = await ProductService.getProductById(id as string);
    if (!product) throw new AppError("Product not found", 404);

    // Normalize existingImages
    if (typeof req.body.existingImages === "string") {
      req.body.existingImages = JSON.parse(req.body.existingImages);
    }
    if (typeof req.body.variants === "string") {
      req.body.variants = JSON.parse(req.body.variants);
    }
    if (typeof req.body.specifications === "string") {
      req.body.specifications = JSON.parse(req.body.specifications);
    }

    const existingImages = req.body.existingImages || []

    // Validate image count
    const totalAfterUpdate = existingImages.length + files.length
    if (totalAfterUpdate > 5) {
      throw new AppError(
        `Maximum 5 images allowed. You are keeping ${existingImages.length} and adding ${files.length}.`,
        400
      );
    }

    // Determine images to delete
    const imagesToDelete = product.images.filter(
      (img) => !existingImages.includes(img)
    );

    imagesToDelete.forEach((img) => {
      const filePath = `src/uploads/product-images/${img}`;
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, () => {});
      }
    });

    // New uploaded images
    const newImages = files.map((file) => file.filename);

    // Final image list (ALWAYS defined)
    const updatedImageList = [...existingImages, ...newImages];

    const updated = await ProductService.updateProduct(id as string, {
      ...req.body,
      images: updatedImageList,
    });

    res.status(200).json({
      success: true,
      product: updated,
      message: "Product updated successfully",
    });
  } catch (err) {
    // Rollback uploaded files on error
    if (files.length) {
      files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlink(file.path, () => {});
        }
      });
    }
    next(err);
  }
};

export const deleteProduct = asyncHandler(async(req, res, next) => {
  const { id } = req.params
  const product = await ProductService.getProductById(id as string)

  await ProductService.deleteProduct(id as string)

  // delete product images
  if (product?.images?.length) {
    product?.images?.forEach((img) => {
      const imgPath = `src/uploads/product-images/${img}`
      if(fs.existsSync(imgPath)){
        fs.unlink(imgPath, () => {})
      }
    })
  }

  res.status(200).json({success: true, message: "Product deleted successfully"})
})

