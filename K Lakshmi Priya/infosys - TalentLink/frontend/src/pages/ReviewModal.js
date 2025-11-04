import React, { useState } from "react";
import { createReview } from "../api/reviews";

const ReviewModal = ({ contractId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createReview({ contract: contractId, rating, comment });
      onSuccess(); 
      onClose();   
    } catch (err) {
      setError(err.response?.data?.detail || "Error submitting review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-lg font-semibold mb-4">Leave a Review</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Rating (1–5)</label>
          <select
            className="border w-full p-2 rounded mb-3"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <label className="block mb-2 font-medium">Comment</label>
          <textarea
            className="border w-full p-2 rounded mb-4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            placeholder="Write your feedback..."
          />

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
