
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

const normalizeEntityType = (type) => {
  if (!type) return null;

  const t = type.toLowerCase().trim();

  // Map to DB constraint values (capitalized)
  if (t === 'foodplace' || t === 'foodplaces' || t === 'food') return 'Food';
  if (t === 'hotel' || t === 'hotels') return 'Hotel';
  if (t === 'attraction' || t === 'attractions') return 'Attraction';
  if (t === 'transport' || t === 'transports') return 'Transport';

  // Throw error for unknown types
  throw new Error(`Invalid entity type: ${type}`);
};


export default function EntityReviewCard({ user, entity, entityType }) {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // ✅ NEW: Edit mode

  useEffect(() => {
    loadReviews();
  }, [entity.id, entityType]);

  const loadReviews = async () => {
    try {
      const data = await api.getReviews(entityType, entity.id);
      setReviews(data);
      
      const userRev = data.find(r => r.user_id === user?.user_id);
      if (userRev) {
        setUserReview(userRev);
        setRating(userRev.rating);
        setComments(userRev.comments || '');
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await api.addReviewsBatch({
        user_id: user.user_id,
        reviews: [{
          entity_type: normalizeEntityType(entityType),
          entity_id: entity.id,
          rating,
          comments
        }]
      });
      alert('✅ Review submitted successfully!');
      setShowReviewForm(false);
      setIsEditing(false);
      loadReviews();
    } catch (err) {
      alert('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowReviewForm(true);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your review?')) return;
    
    try {
      await api.deleteReview(userReview.review_id);
      alert('✅ Review deleted');
      setUserReview(null);
      setRating(0);
      setComments('');
      setIsEditing(false);
      setShowReviewForm(false);
      loadReviews();
    } catch (err) {
      alert('❌ Failed to delete review');
    }
  };

  const handleCancel = () => {
    if (userReview) {
      setRating(userReview.rating);
      setComments(userReview.comments || '');
    } else {
      setRating(0);
      setComments('');
    }
    setShowReviewForm(false);
    setIsEditing(false);
  };

  const Stars = ({ value, onChange, readOnly }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange(s)}
          className={`text-2xl ${s <= value ? 'text-yellow-400' : 'text-gray-300'} ${!readOnly && 'hover:scale-110 cursor-pointer'} transition-transform`}
        >
          ★
        </button>
      ))}
    </div>
  );

  // ✅ Filter out user's review from the list (avoid duplication)
  const otherReviews = reviews.filter(r => r.user_id !== user?.user_id);

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      {/* User's Review Section */}
      {user && (
        <div className="mb-4">
          {!userReview && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Give Rating
            </button>
          )}

          {showReviewForm && (
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-purple-200">
              <h4 className="font-semibold mb-2">
                {isEditing ? 'Edit Your Review' : 'Write a Review'}
              </h4>
              <Stars value={rating} onChange={setRating} readOnly={false} />
              <textarea
                placeholder="Write your review... (optional)"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full mt-3 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                rows="3"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : (isEditing ? 'Update Review' : 'Submit Review')}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {userReview && !showReviewForm && (
            <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-purple-700">Your Review</h4>
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <Stars value={userReview.rating} onChange={() => {}} readOnly={true} />
              {userReview.comments && (
                <p className="text-sm text-gray-700 mt-2 italic">"{userReview.comments}"</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Reviewed on {new Date(userReview.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Other Reviews Section */}
      {otherReviews.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3 text-gray-700">
            What others say ({otherReviews.length})
          </h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {otherReviews.map(rev => (
              <div key={rev.review_id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm text-gray-800">{rev.user_name || 'Anonymous'}</span>
                  <span className="text-yellow-500 text-sm font-semibold">★ {rev.rating}</span>
                </div>
                {rev.comments && (
                  <p className="text-sm text-gray-600 mt-1">"{rev.comments}"</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(rev.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No other reviews message */}
      {otherReviews.length === 0 && reviews.length === 0 && !userReview && (
        <p className="text-sm text-gray-500 text-center py-4">
          No reviews yet. Be the first to review!
        </p>
      )}
    </div>
  );
}