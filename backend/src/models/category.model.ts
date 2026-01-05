import mongoose, { Schema, model } from "mongoose";

const CategorySchema = new Schema({
    name: String,
    slug: String,
    parent: { type: Schema.Types.ObjectId, ref: "Category" },
})

export const CategoryModel = mongoose.model("Category", CategorySchema);