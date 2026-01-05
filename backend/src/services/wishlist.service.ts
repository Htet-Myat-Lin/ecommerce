import { WishlistModel } from "../models/wishlist.model.js";
import type { IProduct } from "../utils/types.js";

export class WishlistService {
    static async getWishlists(userId: string) {
        return await WishlistModel.find({ user: userId}).populate<{ products: IProduct[] }>("products")
    }

    static async addToWishlist(userId: string, productId: string) {
        const wishlist = await WishlistModel.findOneAndUpdate(
            { user: userId },
            { $addToSet: { products: productId } },
            { new: true, upsert: true } // Create if not exists
        );
        return wishlist;
    }

    static async removeFromWishlist(userId: string, productId: string) {
        const wishlist = await WishlistModel.findOneAndUpdate(
            { user: userId },
            { $pull: { products: productId } },
            { new: true }
        );
        return wishlist;
    }

    static async isInWishlist(userId: string, productId: string) {
        const wishlist = await WishlistModel.findOne({ user: userId, products: productId });
        return !!wishlist;
    }

    static async clearWishlist(userId: string) {
        await WishlistModel.findOneAndUpdate(
            { user: userId },
            { $set: { products: [] } },
            { new: true }
        );
    }
}