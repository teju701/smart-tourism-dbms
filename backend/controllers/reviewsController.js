import pool from '../db/index.js';

export const addReviewsBatch = async (req, res) => {
  const { user_id, reviews } = req.body;
  
  // Validate input
  if (!user_id || !Array.isArray(reviews) || reviews.length === 0) {
    return res.status(400).json({ error: 'user_id and non-empty reviews array required' });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    // ✅ FIX: Cast parameters explicitly
    const sql = `CALL add_reviews_batch($1::INT, $2::JSONB)`;
    await client.query(sql, [user_id, JSON.stringify(reviews)]);

    await client.query('COMMIT');
    return res.status(201).json({ message: 'Reviews added successfully' });
    
  } catch (err) {
    if (client) {
      try { 
        await client.query('ROLLBACK'); 
      } catch (rbErr) { 
        console.error('Rollback failed:', rbErr.message); 
      }
    }

    console.error('Error adding reviews batch:', err.message);

    const msg = err.message || '';
    if (msg.includes('has no booking')) {
      return res.status(400).json({ error: msg });
    }

    return res.status(500).json({ error: 'Failed to add reviews: ' + msg });
    
  } finally {
    if (client) client.release();
  }
};

// ✅ Get reviews by entity
export const getReviewsByEntity = async (req, res) => {
  const { entity_type, entity_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM get_reviews_by_entity($1, $2)',
      [entity_type, entity_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching entity reviews:', err.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const getUserReviews = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT review_id, user_id, entity_type, entity_id, rating, comments, created_at FROM reviews WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user reviews:', err.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const updateReview = async (req, res) => {
  const { review_id } = req.params;
  const { rating, comments } = req.body;
  try {
    await pool.query(
      'UPDATE reviews SET rating = $1, comments = $2 WHERE review_id = $3',
      [rating, comments, review_id]
    );
    res.json({ message: 'Review updated successfully' });
  } catch (err) {
    console.error('Error updating review:', err.message);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

export const deleteReview = async (req, res) => {
  const { review_id } = req.params;
  try {
    await pool.query('DELETE FROM reviews WHERE review_id = $1', [review_id]);
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err.message);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};