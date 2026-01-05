import { Schema, model } from "mongoose"
import type { IReview } from "../utils/types.js"

const reviewSchema = new Schema<IReview>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
}, {
    timestamps: true
})

export const ReviewModel = model<IReview>("Review", reviewSchema)