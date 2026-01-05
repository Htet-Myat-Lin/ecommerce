import {Schema, model} from "mongoose";
import type {IPayment} from "../utils/types.js";

const paymentSchema = new Schema<IPayment>({
    order: {type: Schema.Types.ObjectId, ref: "Order"},
    method: {type: String, required: true},
    transactionId: String,
    status: String
},{
    timestamps: true
})

export const PaymentModel = model("Payment", paymentSchema);