import React, { useState } from "react";
import { motion } from "framer-motion";
import "./ReviewModal.css";

export default function ClientReviewModal({ onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide both rating and comment!");
      return;
    }
    onSubmit({ rating, comment, date: new Date().toISOString() });
    onClose();
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div className="modal-box" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
        <h3>Leave a Review</h3>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              onClick={() => setRating(s)}
              style={{ color: s <= rating ? "#FFD700" : "#ccc", fontSize: "1.8rem", cursor: "pointer" }}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="buttons">
          <button className="submit" onClick={handleSubmit}>Submit</button>
          <button className="cancel" onClick={onClose}>Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
