// src/api/reviews.js
import api from "./axios";

// Fetch reviews for a contract
export const getReviewsByContract = async (contractId) => {
  const token = localStorage.getItem("access");
  return api.get(`/reviews/?contract=${contractId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Create a new review
export const createReview = async ({ contract, rating, comment }) => {
  const token = localStorage.getItem("access");
  return api.post(
    "/reviews/",
    { contract, rating, comment },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
