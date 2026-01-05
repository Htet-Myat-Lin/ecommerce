import { CategoryModel } from "../models/category.model.js";
import type { ICategory } from "../utils/types.js";

export class CategoryService {
    static async createCategory(data: Partial<ICategory>) {
        const newCategory = new CategoryModel(data);
        await newCategory.save();
        return newCategory;
    }

    static async getCategories() {
        return CategoryModel.find().populate('parent').lean();
    }

    static async getCategoryById(id: string) {
        return CategoryModel.findById(id).populate('parent').lean();
    }

    static async updateCategory(id: string, data: Partial<ICategory>) {
        const updated = await CategoryModel.findByIdAndUpdate(id, data, { new: true });
        return updated;
    }

    static async deleteCategory(id: string) {
        await CategoryModel.findByIdAndDelete(id);
        return { success: true };
    }
}
