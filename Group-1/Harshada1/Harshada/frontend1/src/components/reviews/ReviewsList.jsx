import React, { useEffect, useState } from "react";

const ReviewsList = ({ userId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(()=>{
    fetch(`/marketplace/api/reviews/?reviewed_user=${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
    })
      .then(res => res.json())
      .then(setReviews)
  }, [userId]);

  if (reviews.length === 0) return <div>No reviews yet</div>;

  return (
    <div className="reviews-list">
      {reviews.map(r => (
        <div key={r.id} className="review-card">
          <div className="review-header">
            <strong>{r.reviewer_username}</strong>
            <span>⭐ {r.rating}/5</span>
          </div>
          <div className="review-body">{r.comment}</div>
          <small>{new Date(r.created_at).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
