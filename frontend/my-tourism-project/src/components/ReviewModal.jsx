// frontend/src/components/ReviewModal.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" onClick={() => onChange(s)} className={`text-2xl ${s <= value ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
      ))}
    </div>
  );
}

export default function ReviewModal({ show, onClose, user, entityIds }) {
  const [open, setOpen] = useState(show);
  useEffect(() => setOpen(show), [show]);

  const [transport, setTransport] = useState({ rating: 0, comments: '' });
  const [hotel, setHotel] = useState({ rating: 0, comments: '' });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const collectReviews = () => {
    const arr = [];
    if (transport.rating > 0 && entityIds?.transport?.id) {
      arr.push({
        entity_type: 'transport',
        entity_id: entityIds.transport.id,
        rating: transport.rating,
        comments: transport.comments || ''
      });
    }
    if (hotel.rating > 0 && entityIds?.hotel?.id) {
      arr.push({
        entity_type: 'hotel',
        entity_id: entityIds.hotel.id,
        rating: hotel.rating,
        comments: hotel.comments || ''
      });
    }
    return arr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = collectReviews();
    if (payload.length === 0) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await api.addReviewsBatch({ user_id: user.user_id, reviews: payload });
      alert('✅ Reviews submitted successfully!');
      onClose();
    } catch (err) {
      // err.message should contain server's error now
      console.error('Submit review error:', err);
      alert('❌ Failed to submit review: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-[600px] p-6">
        <h2 className="text-xl font-bold mb-3">Leave a Review</h2>
        <p className="text-sm text-gray-600 mb-4">You can rate the hotel and transport you recently booked.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border rounded-lg">
            <div className="font-semibold">Transport {entityIds?.transport?.name ? `- ${entityIds.transport.name}` : ''}</div>
            <div className="mt-2"><Stars value={transport.rating} onChange={(v)=>setTransport(prev=>({...prev,rating:v}))} /></div>
            <textarea placeholder="Optional comments" value={transport.comments} onChange={(e)=>setTransport(prev=>({...prev,comments:e.target.value}))} className="w-full mt-2 p-2 border rounded" rows="2"/>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="font-semibold">Hotel {entityIds?.hotel?.name ? `- ${entityIds.hotel.name}` : ''}</div>
            <div className="mt-2"><Stars value={hotel.rating} onChange={(v)=>setHotel(prev=>({...prev,rating:v}))} /></div>
            <textarea placeholder="Optional comments" value={hotel.comments} onChange={(e)=>setHotel(prev=>({...prev,comments:e.target.value}))} className="w-full mt-2 p-2 border rounded" rows="2"/>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            {loading ? 'Submitting...' : 'Submit & Logout'}
          </button>
        </div>
      </form>
    </div>
  );
}