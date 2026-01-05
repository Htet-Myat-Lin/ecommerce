import React, { useState } from "react";
import { useCheckExistingReview, useGetProductReviewsQuery } from "../../hooks/queries";
import { 
  useCreateReviewMutation, 
  useDeleteReviewMutation, 
  useUpdateReviewMutation 
} from "../../hooks/mutations";
import { Edit, Star, ThumbsUp, Trash2, X, Check } from "lucide-react";
import { Button, Card, Textarea } from "flowbite-react";
// import { useAuthStore } from "../../store/authStore";

type Review = { _id: string; rating: number; comment: string; updatedAt: string, user: { username: string }}

export function ReviewComponent({ productId }: { productId: string }) {
  const { data, isPending } = useGetProductReviewsQuery(productId);
  const { mutate: addReview, isPending: submitting } = useCreateReviewMutation();
  const { mutate: deleteReview } = useDeleteReviewMutation();
  const { mutate: updateReview, isPending: updating } = useUpdateReviewMutation();
  const { data: checkExistingReview } = useCheckExistingReview(productId)
  const hasExistingReview = checkExistingReview?.hasExistingReview || false
  console.log(hasExistingReview)

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Edit Review State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  const productReviews = data?.reviews || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Create Review Handler
  const createReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating");
    if (!comment.trim()) return alert("Please write a review");

    addReview({ productId, rating, comment }, {
      onError: () => {
        setComment("");
        setRating(0);
      },
      onSuccess: () => {
        setComment("");
        setRating(0);
      }
    });
  };

  // Edit Handlers
  const startEditing = (review: Review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditRating(0);
    setEditComment("");
  };

  const handleUpdate = (reviewId: string) => {
    if (editRating === 0 || !editComment.trim()) return;
    
    updateReview(
      { productId, reviewId, rating: editRating, comment: editComment },
      { onSuccess: () => cancelEditing() }
    );
  };

  return (
    <>
      {/* ADD REVIEW FORM */}
      <form onSubmit={createReview} className="space-y-4 mb-8 shadow-lg p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`p-1 transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                onClick={() => setRating(star)}
              >
                <Star className={`w-6 h-6 ${star <= rating ? "fill-current" : "stroke-current"}`} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            required
          />
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>

      {/* REVIEWS LIST */}
      <div className="space-y-4">
        {isPending ? (
          <p className="text-center py-4">Loading reviews...</p>
        ) : (
          productReviews.map((review: Review) => (
            <Card key={review._id} className="w-full">
              <div className="p-1">
                {editingId === review._id ? (
                  /* --- EDIT MODE UI --- */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Editing Review</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditRating(star)}
                            className={star <= editRating ? "text-yellow-400" : "text-gray-300"}
                          >
                            <Star className={`w-5 h-5 ${star <= editRating ? "fill-current" : ""}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="xs" onClick={() => handleUpdate(review._id)} disabled={updating}>
                        <Check className="w-4 h-4 mr-1" /> {updating ? "Editing..." : "Edit"}
                      </Button>
                      <Button size="xs" color="light" onClick={cancelEditing}>
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* --- VIEW MODE UI --- */
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? "fill-current" : "stroke-current"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(review.updatedAt)}</span>
                      </div>

                      { hasExistingReview && (
                        <div className="flex gap-2">
                        <button 
                          onClick={() => startEditing(review)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteReview({ reviewId: review._id, productId })}
                          className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      )}
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium text-gray-700">{review.user.username}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        Verified Purchase <ThumbsUp className="w-3 h-3" />
                      </span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}