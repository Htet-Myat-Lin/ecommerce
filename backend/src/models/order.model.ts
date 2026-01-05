import {Schema, model} from "mongoose";
import type {IOrder} from "../utils/types.js";

const OrderSchema = new Schema<IOrder>({
    user: {  type: Schema.Types.ObjectId, ref: "User" },
    items: [
        {
            product: {type: Schema.Types.ObjectId, ref: "Product"},
            variantSku: String,
            quantity: Number,
            price: Number,
        }
    ],
    totalPrice: Number,
    status: { type: String, default: "pending" },
    paymentStatus: { type: String, default: "pending" }
},{
    timestamps: true
})

export const OrderModel = model<IOrder>("Order", OrderSchema);