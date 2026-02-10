import React, { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function MyBookings({ user, setUser }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [processing, setProcessing] = useState(false);

  // ✅ Load user bookings
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.getUserBookings(user.user_id);
        setBookings(data);
      } catch (err) {
        setError(err.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // ✅ Cancel booking function (with budget update)
  const handleCancelBooking = async (bookingId) => {
    setProcessing(true);
    try {
      // find booking being cancelled
      const cancelledBooking = bookings.find((b) => b.booking_id === bookingId);
      if (!cancelledBooking) throw new Error('Booking not found');

      await api.cancelBooking(bookingId);

      // remove from list
      setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));

      // ✅ update user budget instantly
      const refund = parseFloat(cancelledBooking.total_cost);
      setUser((prevUser) => ({
        ...prevUser,
        budget: parseFloat(prevUser.budget) + refund,
      }));

      setCancelConfirm(null);
    } catch (err) {
      alert('❌ Failed to cancel booking: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!user)
    return <div className="p-6 text-center text-gray-600">Please login to view bookings.</div>;
  if (loading)
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  if (error)
    return <div className="p-6 text-red-600 text-center">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-gray-600 text-center bg-white shadow-sm rounded-lg p-6">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((b) => (
            <div
              key={b.booking_id}
              className="p-5 bg-white shadow-lg rounded-2xl border border-purple-100 hover:shadow-xl transition-all"
            >
              {/* Header Row */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-purple-700 text-lg">
                    Booking #{b.booking_id}
                  </div>
                  <div className="text-sm text-gray-500">
                    On: {new Date(b.booking_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-purple-700">${b.total_cost}</div>
                </div>
              </div>

              {/* Details */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700">
                <div>
                  <div className="font-semibold">Hotel</div>
                  <div>{b.hotel_name || 'N/A'}</div>
                </div>
                <div>
                  <div className="font-semibold">Transport</div>
                  <div>{b.transport_provider || 'N/A'}</div>
                </div>
                <div>
                  <div className="font-semibold">City</div>
                  <div>{b.city_name ? b.city_name : 'Unknown City'}</div>
                </div>

                <div>
                  <div className="font-semibold">Booking ID</div>
                  <div>{b.booking_id}</div>
                </div>
              </div>

              {/* Cancel Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setCancelConfirm(b.booking_id)}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-all"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Cancel Confirmation Modal */}
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center animate-fadeIn">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Cancel this Booking?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? The amount will be refunded to your
              wallet.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleCancelBooking(cancelConfirm)}
                disabled={processing}
                className={`px-6 py-2 rounded-lg font-semibold text-white transition-all ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 shadow-md'
                }`}
              >
                {processing ? 'Processing...' : 'Yes, Cancel'}
              </button>

              <button
                onClick={() => setCancelConfirm(null)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}