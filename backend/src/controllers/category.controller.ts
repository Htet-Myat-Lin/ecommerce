import type { Request, Response } from "express";
import { CategoryService } from "../services/category.service.js";
import type { ICategory } from "../utils/types.js";
import { AppError } from "../utils/app.error.js";
import { asyncHandler } from "../utils/async.handler.js";

export const createCategory = asyncHandler(async(req, res, next) => {
  const data = req.body as Partial<ICategory>;
    if (!data.name || !data.slug) {
      throw new AppError("Missing required fields: name, slug", 400)
    }
    const category = await CategoryService.createCategory(data);
    return res.status(201).json({ success: true, category, message: "Category created successfully" });
})

export const getCategories = asyncHandler(async(req, res, next) => {
    const categories = await CategoryService.getCategories();
    return res.status(200).json({ success: true, categories });
})

export const updateCategory = asyncHandler(async(req, res, next) => {
   const id = req.params.id as string;
    const data = req.body as Partial<ICategory>;
    const updated = await CategoryService.updateCategory(id, data);
    return res.status(200).json({ success: true, category: updated });
})

export const deleteCategory = asyncHandler(async(req, res, next) => {
   const id = req.params.id as string;
    await CategoryService.deleteCategory(id);
    return res.status(200).json({ success: true });
})
