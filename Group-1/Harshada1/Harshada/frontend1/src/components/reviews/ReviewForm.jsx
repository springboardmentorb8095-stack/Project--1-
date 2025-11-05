import React, { useState } from "react";

const StarRating = ({ value, setValue }) => {
  return (
    <div>
      {[1,2,3,4,5].map((i) => (
        <span
          key={i}
          style={{ cursor: "pointer", fontSize: 22, color: i <= value ? "#f5b50a" : "#ccc" }}
          onClick={() => setValue(i)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewForm = ({ reviewedUserId, contractId, onSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/marketplace/api/reviews/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`
      },
      body: JSON.stringify({
        reviewed_user: reviewedUserId,
        contract: contractId,
        rating,
        comment
      })
    }).then(res => {
      if (res.ok) {
        setRating(5);
        setComment("");
        if (onSubmitted) onSubmitted();
        alert("Review submitted");
      } else {
        alert("Error submitting review");
      }
    })
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <label>Rating</label>
      <StarRating value={rating} setValue={setRating} />
      <label>Comment</label>
      <textarea value={comment} onChange={(e)=>setComment(e.target.value)} />
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
