import { Schema, model } from "mongoose";
import type {IWishlist} from "../utils/types.js";

const wishlistSchema = new Schema<IWishlist>({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }]
},{
    timestamps: true
})

export const WishlistModel = model<IWishlist>("Wishlist", wishlistSchema);