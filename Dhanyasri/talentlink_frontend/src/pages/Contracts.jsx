import React, { useEffect, useState } from "react";
import API from "../api.js";
import NavigationBar from "./NavigationBar";
import styles from "../styles/Contracts.module.css";

function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [reviewInputs, setReviewInputs] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState([]); // ✅ Track submitted reviews

  // ✅ Fetch all contracts
  const fetchContracts = async () => {
    try {
      const res = await API.get("contracts/");
      setContracts(res.data);

      // ✅ Track contracts that already have a review
      const reviewed = res.data
        .filter((c) => c.review && c.rating)
        .map((c) => c.id);
      setSubmittedReviews(reviewed);
    } catch (err) {
      console.error("❌ Failed to fetch contracts:", err);
      alert("Failed to load contracts. Please ensure you're logged in.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark contract as completed
  const markAsCompleted = async (id) => {
    if (!window.confirm("Are you sure you want to mark this contract as completed?")) return;

    setUpdating(id);
    try {
      const response = await API.put(`contracts/${id}/mark_completed/`);
      console.log("✅ Contract marked as completed:", response.data);

      setContracts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Completed" } : c))
      );

      alert("✅ Contract marked as completed successfully!");
    } catch (err) {
      console.error("❌ Failed to update contract:", err);
      const { status, data } = err.response || {};
      if (data?.detail === "Contract already completed.") {
        alert("⚠️ This contract is already marked as completed.");
      } else if (status === 401) {
        alert("Unauthorized: Please log in again.");
      } else if (status === 404) {
        alert("Contract not found.");
      } else {
        alert(`❌ ${data?.detail || "Failed to update contract."}`);
      }
    } finally {
      setUpdating(null);
    }
  };

  // ✅ Submit review & rating (uses PATCH instead of PUT)
  const submitReview = async (id) => {
    const { review, rating } = reviewInputs[id] || {};

    // Validate input
    if (!review || review.trim().length < 3) {
      alert("Please enter a valid review (at least 3 characters).");
      return;
    }

    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      alert("Please provide a valid rating between 1 and 5.");
      return;
    }

    try {
      // ✅ Changed to PATCH so only review & rating are updated
      const res = await API.patch(`contracts/${id}/`, {
        review: review.trim(),
        rating: parsedRating,
      });

      console.log("✅ Review submitted:", res.data);

      // ✅ Update UI with submitted data
      setContracts((prev) =>
        prev.map((c) => (c.id === id ? res.data : c))
      );

      // ✅ Hide review form after submission
      setSubmittedReviews((prev) => [...prev, id]);

      // ✅ Reset input fields
      setReviewInputs((prev) => ({
        ...prev,
        [id]: { review: "", rating: "" },
      }));

      alert("✅ Review & Rating submitted successfully!");
    } catch (err) {
      console.error("❌ Failed to submit review:", err);

      const backendMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        "Failed to submit review. Please try again.";

      alert(`⚠️ ${backendMsg}`);
    }
  };

  // ✅ Handle input change
  const handleInputChange = (id, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // ✅ Fetch on mount
  useEffect(() => {
    fetchContracts();
  }, []);

  if (loading) return <p className={styles.loading}>Loading contracts...</p>;

  return (
    <div className={styles.pageWrapper}>
      {/* Sidebar */}
      <nav>
        <NavigationBar />
      </nav>

      {/* Main Content */}
      <div className={styles.content}>
        <h1>Contracts</h1>

        {contracts.length === 0 ? (
          <p>No contracts found.</p>
        ) : (
          contracts.map((contract) => (
            <div key={contract.id} className={styles.card}>
              <p>
                <strong>Project:</strong> {contract.project_title || "N/A"}
              </p>
              <p>
                <strong>Freelancer:</strong> {contract.freelancer || "N/A"}
              </p>
              <p>
                <strong>Client:</strong> {contract.client || "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    contract.status === "Completed"
                      ? styles.completed
                      : styles.active
                  }
                >
                  {contract.status || "N/A"}
                </span>
              </p>
              <p>
                <strong>Payment:</strong> ₹{contract.payment_amount || "0"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {contract.created_at
                  ? new Date(contract.created_at).toLocaleString()
                  : "N/A"}
              </p>

              {/* ✅ Mark as completed button */}
              {contract.status !== "Completed" && (
                <button
                  className={styles.completeBtn}
                  onClick={() => markAsCompleted(contract.id)}
                  disabled={updating === contract.id}
                >
                  {updating === contract.id ? "Updating..." : "Mark as Completed"}
                </button>
              )}

              {/* ✅ Review Section (Visible only if completed and not reviewed yet) */}
              {contract.status === "Completed" &&
                !submittedReviews.includes(contract.id) && (
                  <div className={styles.reviewSection}>
                    <h4>Leave a Review & Rating</h4>

                    <label>⭐ Rating:</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={reviewInputs[contract.id]?.rating || ""}
                      onChange={(e) =>
                        handleInputChange(contract.id, "rating", e.target.value)
                      }
                      placeholder="Rate out of 5"
                      className={styles.ratingInput}
                    />

                    <label>📝 Review:</label>
                    <textarea
                      rows="3"
                      value={reviewInputs[contract.id]?.review || ""}
                      onChange={(e) =>
                        handleInputChange(contract.id, "review", e.target.value)
                      }
                      placeholder="Write your feedback..."
                      className={styles.reviewInput}
                    ></textarea>

                    <button
                      className={styles.submitBtn}
                      onClick={() => submitReview(contract.id)}
                    >
                      Submit Review
                    </button>
                  </div>
                )}

              {/* ✅ Show existing review if already given */}
              {submittedReviews.includes(contract.id) && contract.review && (
                <div className={styles.existingReview}>
                  <p>
                    <strong>Your Review:</strong> {contract.review}
                  </p>
                  <p>
                    <strong>Rating:</strong> ⭐ {contract.rating}/5
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Contracts;
