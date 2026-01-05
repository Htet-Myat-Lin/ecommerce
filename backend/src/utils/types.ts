import type { Request } from "express";
import mongoose, { type Document, type Model, type Types } from "mongoose";

export interface IUser extends Document{
    username: string;
    email: string;
    password: string;
    confirmPassword?: string | undefined;
    createdAt?: Date;
    updatedAt?: Date;
    active?: boolean;
    isEmailVerified?: boolean;
    verifyOTP?: string | undefined;
    verifyOTPExpiry?: number | undefined;
    verifyOTPGeneratedAt?: number | undefined;
    resetPasswordOTP?: string | undefined;
    resetPasswordOTPExpiry?: number | undefined;
    resetPasswordOTPGeneratedAt?: number | undefined;
    role: "user" | "admin";
    profilePictures?: string[] | null;
    refreshToken?: string | undefined;
}

export interface UserMethods {
    comparePassword: (password: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUser, {}, UserMethods> {}

export interface AuthRequest extends Request{
    user?: IUser;
}

export interface ICategory extends Document {
    name: string;
    slug: string;
    parent?: mongoose.Types.ObjectId;
}

export interface IVariant {
    sku: string;
    color?: string;
    ram?: string;
    storage: string;
    price: number;
    stock: number;
}

export interface IProduct extends Document {
    title: string;
    description: string;
    slug: string;
    brand: string;
    price: number;
    discountPrice: number;
    category: mongoose.Types.ObjectId;
    variants: IVariant[];
    specifications: Record<string, string>
    images: string[];
    rating: number;
    isFeatured: boolean;
}

export interface ICartItem {
    product: mongoose.Types.ObjectId;
    variantSku?: string;
    quantity: number;
}

export interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
}

export interface IWishlist extends Document {
    user: mongoose.Types.ObjectId;
    products: mongoose.Types.ObjectId[];
}

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    variantSku?: string;
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalPrice: number;
    status: "pending" | "shipped" | "delivered" | "cancelled";
    paymentStatus: "pending" | "paid" | "failed";
}

export interface IPayment extends Document {
    order: mongoose.Types.ObjectId;
    method: string;
    transactionId: string;
    status: string;
}

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    type: "MESSAGE" | "ORDER" | "SYSTEM";
    content: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type ProductFilters = {
    category?: string;
    brand?: string[],
    priceRange?: { min: number; max: number };
    categoryIds?: string[];
    search?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
};