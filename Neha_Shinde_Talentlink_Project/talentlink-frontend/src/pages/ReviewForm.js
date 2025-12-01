import React, { useState } from 'react';
import axios from '../api/axios';

function ReviewForm({ projectId, reviewedId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    console.log('Submitting review:', {
      project: projectId,
      reviewed: reviewedId,
      rating: Number(rating),
      comment
    });

    try {
      await axios.post('/reviews/', {
        project: projectId,
        reviewed: reviewedId,
        rating: Number(rating),
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Review submitted!');
    } catch (err) {
      console.error('Review error:', err.response?.data || err.message);
      alert('Failed to submit review. Please check your input.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#f9f9ff',
      padding: '20px',
      borderRadius: '10px',
      border: '1px solid #ddd',
      marginTop: '10px'
    }}>
      <h4 style={{
        marginBottom: '15px',
        color: '#6a11cb',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        ✍️ Leave a Review
      </h4>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
          Rating (1–5):
        </label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          style={{
            width: '60px',
            padding: '6px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
          Comment:
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience..."
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            resize: 'vertical'
          }}
        />
      </div>

      <button type="submit" style={{
        backgroundColor: '#6a11cb',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500'
      }}>
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;


/*import React, { useState } from 'react';
import axios from '../api/axios';

function ReviewForm({ projectId, reviewedId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    console.log('Submitting review:', {
      project: projectId,
      reviewed: reviewedId,
      rating: Number(rating),
      comment
    });

    try {
      await axios.post('/reviews/', {
        project: projectId,
        reviewed: reviewedId,
        rating: Number(rating), // ✅ ensure it's a number
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Review submitted!');
    } catch (err) {
      console.error('Review error:', err.response?.data || err.message);
      alert('Failed to submit review. Please check your input.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Rating (1–5):</label>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={e => setRating(Number(e.target.value))} // ✅ convert to number
      />
      <label>Comment:</label>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;*/
