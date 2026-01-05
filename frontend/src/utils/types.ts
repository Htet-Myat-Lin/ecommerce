import type { ICategory } from "../api/category.api";

export interface IUser {
    _id: string;
    username: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
    isEmailVerified?: boolean;
    role: "user" | "admin";
    profilePictures?: string[] | null;
}

export interface IVariant {
    sku: string;
    color?: string;
    ram?: string;
    storage: string;
    price: number;
    stock: number;
}

export interface IProduct {
    _id: string;
    title: string;
    description: string;
    slug: string;
    brand: string;
    price: number;
    discountPrice: number;
    category: string | ICategory;
    variants: IVariant[];
    specifications: Record<string, string>;    
    images: string[];
    rating: number;
    isFeatured: boolean;
}

export type AuthStore = {
    user: IUser | null;
    loading: boolean;
    accessToken: string | null;
    
    fetchUser: () => Promise<void>;
    setUser: (data: IUser | null) => void;
    setAccessToken: (token: string | null) => void;
}

export type ProductFormStore = {
    currentStep: number;
    totalSteps: number;
    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: number) => void;
    resetStep: () => void;
}

export type ModalStore = {
    openLoginModal: boolean;
    openRegisterModal: boolean;
    setOpenLoginModal: (open: boolean) => void;
    setOpenRegisterModal: (open: boolean) => void;
}

export type Role = "admin" | "user"