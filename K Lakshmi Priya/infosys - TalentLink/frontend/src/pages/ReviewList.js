import React, { useEffect, useState } from "react";
import { getReviewsByContract } from "../api/reviews";

const ReviewList = ({ contractId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getReviewsByContract(contractId);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [contractId]);

  if (loading) return <p>Loading reviews...</p>;
  if (reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="border p-3 rounded shadow-sm">
          <p className="font-semibold">{r.reviewer_name}</p>
          <p>Rating: {r.rating} ⭐</p>
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
