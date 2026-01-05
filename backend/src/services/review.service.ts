import { ReviewModel } from "../models/review.model.js";

export class ReviewService{
    static async createReview(data: { user: string, product: string, rating: number, comment: string }){
        return await ReviewModel.create(data)
    }

    static async checkExistingReview(userId: string, productId: string) {
        const review = await ReviewModel.findOne({user: userId, product: productId})
        return !!review
    }

    static async getProductReviews(productId: string) {
        return await ReviewModel.find({product: productId}).populate("user").lean()
    }

    static async updateReview(reviewId: string, userId: string, data: { rating: number, comment: string }) {
        return await ReviewModel.findOneAndUpdate({_id: reviewId, user: userId }, data, { new: true })
    }

    static async deleteReview(reviewId: string, userId: string) {
        return await ReviewModel.findOneAndDelete({_id: reviewId, user: userId})
    }

    static async getUserReviews(userId: string) {
        return await ReviewModel.find({user: userId}).lean()
    }
}