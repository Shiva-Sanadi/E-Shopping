// ProductReviews.jsx
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaStar, FaRegStar, FaEdit, FaTrash, FaThumbsUp } from "react-icons/fa";
import { addReview, updateReview, deleteReview } from "../redux/ReviewSlice";

const ProductReviews = ({ productId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.reviews[productId] || []);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    title: "",
    comment: "",
  });
  const [sortBy, setSortBy] = useState("newest");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingReview) {
      dispatch(
        updateReview({
          productId,
          reviewId: editingReview.id,
          updatedReview: formData,
        })
      );
      setEditingReview(null);
    } else {
      dispatch(addReview({ productId, review: formData }));
    }
    setFormData({ name: "", rating: 5, title: "", comment: "" });
    setShowForm(false);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
    });
    setShowForm(true);
  };

  const handleDelete = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview({ productId, reviewId }));
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "oldest":
        return new Date(a.date) - new Date(b.date);
      default: // newest
        return new Date(b.date) - new Date(a.date);
    }
  });

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length
      ? ((reviews.filter((r) => r.rating === star).length / reviews.length) * 100).toFixed(0)
      : 0,
  }));

  const StarRating = ({ rating, onRatingChange, interactive = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange(star)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : ""} transition-transform`}
            disabled={!interactive}
          >
            {star <= rating ? (
              <FaStar className="text-yellow-500 text-xl" />
            ) : (
              <FaRegStar className="text-gray-300 text-xl" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="text-center md:border-r md:pr-8">
            <div className="text-5xl font-bold text-gray-800 mb-2">{averageRating}</div>
            <StarRating rating={Math.round(averageRating)} />
            <p className="text-gray-600 mt-2">{reviews.length} reviews</p>
          </div>

          <div className="flex-1">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-4 mb-2">
                <span className="text-sm w-12">{star} star</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
        >
          Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingReview ? "Edit Review" : "Write Your Review"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rating</label>
              <StarRating
                rating={formData.rating}
                onRatingChange={(rating) => setFormData({ ...formData, rating })}
                interactive
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Review Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Review</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                {editingReview ? "Update Review" : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingReview(null);
                  setFormData({ name: "", rating: 5, title: "", comment: "" });
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{reviews.length} Reviews</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-gray-800">{review.name}</span>
                  <StarRating rating={review.rating} />
                </div>
                <h4 className="font-semibold text-lg">{review.title}</h4>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(review)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-3">{review.comment}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{new Date(review.date).toLocaleDateString()}</span>
              <button className="flex items-center gap-1 hover:text-red-600">
                <FaThumbsUp /> Helpful
              </button>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No reviews yet. Be the first to review!</p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;