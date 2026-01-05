import { ProductModel } from "../models/product.model.js";
import type { IProduct, ProductFilters } from "../utils/types.js";

export class ProductService{
    static async createProduct(data: IProduct) {
        const newProduct = new ProductModel(data)
        await newProduct.save()
        return newProduct
    }

    static async getProducts(filters: ProductFilters = {}) {
        const { brand, priceRange, categoryIds, search, sortBy, page = 1, limit = 10 } = filters;

        const skip = (page - 1) * limit;

        const queryFilters: any = {};
        if (categoryIds && categoryIds.length > 0) {
            queryFilters.category = { $in: categoryIds };
        }
        if (brand && brand.length > 0) {
            queryFilters.brand = { $in: brand };
        }
        if (priceRange) {
            queryFilters.price = { $gte: priceRange.min, $lte: priceRange.max };
        }
        if (search && search.trim().length > 0) {
            const searchTerm = new RegExp(search, "i");
            queryFilters.$or = [
                { title: { $regex: searchTerm } },
                { description: { $regex: searchTerm } }
            ];
        }

        let sort: any = {};
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort.price = 1;
                    break;
                case "priceDesc":
                    sort.price = -1;    
                    break;
                case "newest":
                    sort.createdAt = -1;
                    break;
                case "oldest":
                    sort.createdAt = 1;
                    break;
                default:
                    break;
            }
        } else {
            sort.createdAt = -1; // Default sorting by newest
        }

        const productQuery = ProductModel.find(queryFilters)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate({ path: "category", select: "name" })
            .lean();

        const totalCountQuery = ProductModel.countDocuments(queryFilters);

        const [products, totalCount] = await Promise.all([productQuery, totalCountQuery]);

        const totalPages = Math.ceil(totalCount / limit);

        return { products, totalPages }
    }

    static async getProductById(id: string) {
        return ProductModel.findById(id).lean();
    }

    static async updateProduct(id: string, data: Partial<IProduct>) {
        const updated = await ProductModel.findByIdAndUpdate(id, data, { new: true });
        return updated;
    }

    static async deleteProduct(id: string) {
        await ProductModel.findByIdAndDelete(id);
    }
}