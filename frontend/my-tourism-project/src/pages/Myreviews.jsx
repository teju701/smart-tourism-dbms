import React, { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function MyReviews({ user }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const data = await api.getUserReviews(user.user_id);
      setReviews(data);
    };
    load();
  }, [user]);

  if (!user) return <div>Please login</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Reviews</h1>
      {reviews.length === 0 ? <div>No reviews yet.</div> :
        reviews.map(r => (
          <div key={r.review_id} className="p-4 border rounded mb-3 bg-white shadow-sm">
            <div className="font-semibold capitalize">{r.entity_type}</div>
            <div>Rating: {r.rating}★</div>
            <div className="text-gray-600">{r.comments}</div>
          </div>
        ))
      }
    </div>
  );
}