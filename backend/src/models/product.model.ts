import mongoose, { Schema, model } from "mongoose"
import type {IProduct, IVariant} from "../utils/types.js";

const VariantSchema = new Schema<IVariant>({
    sku: { type: String, required: true },
    color: String,
    ram: String,
    storage: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 }
});

const productSchema = new Schema<IProduct>({
    title: { type: String, required: [true, "Product name is required"] },
    slug: { type: String, required: [true, "Product name is required"], unique: true },
    brand: {type: String, required: [true, "Brand is required"]},
    description: { type: String, required: [true, "Product description is required"] },
    price: { type: Number, required: [true, "Product price is required"] },
    discountPrice: { type: Number, required: [true, "Product discount is required"] },
    category: { type: Schema.Types.ObjectId, required: [true, "Product category is required"], ref: "Category" },
    variants: [VariantSchema],
    specifications: { type: Map, of: String },
    images: [String],
    rating: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
},{
    timestamps: true
})

export const ProductModel = mongoose.model<IProduct>("Product", productSchema);