import pool from '../db/index.js';

export const createBooking = async (req, res) => {
    const { user_id, transport_id, hotel_id } = req.body;
    
    try {
        const result = await pool.query(
            'SELECT fn_create_booking($1, $2, $3) as booking_id',
            [user_id, transport_id, hotel_id]
        );
        
        const bookingId = result.rows[0].booking_id;
        
        // Get total cost
        const costResult = await pool.query(
            'SELECT total_cost FROM bookings WHERE booking_id = $1',
            [bookingId]
        );
        
        res.json({
            booking_id: bookingId,
            total_cost: costResult.rows[0].total_cost,
            message: 'Booking created successfully'
        });
    } catch (err) {
        console.error("Error creating booking:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const cancelBooking = async (req, res) => {
  const { booking_id } = req.params;
  try {
    await pool.query('SELECT * FROM cancel_booking($1)', [booking_id]);
    res.json({ message: 'Booking cancelled and refund processed' });
  } catch (err) {
    console.error('Error cancelling booking:', err.message);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};


export const getLastBookingForUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM get_last_booking($1)', [user_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching last booking:', err.message);
    res.status(500).json({ error: 'Failed to fetch last booking' });
  }
};

export const getBookingsForUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM get_bookings_by_user($1)', [user_id]);
    res.json(result.rows); // array of bookings
  } catch (err) {
    console.error('Error fetching bookings:', err.message);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};