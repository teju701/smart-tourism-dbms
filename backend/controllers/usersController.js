
import pool from '../db/index.js';

export const addBudget = async (req, res) => {
  try {
    const { user_id, amount } = req.body;

    if (!user_id || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Call SQL function to add budget
    await pool.query("SELECT add_user_budget($1, $2);", [user_id, amount]);

    // Fetch updated budget
    const updated = await pool.query("SELECT budget FROM users WHERE user_id = $1;", [user_id]);

    res.json({
      success: true,
      newBudget: updated.rows[0].budget,
    });
  } catch (error) {
    console.error("Error adding budget:", error);
    res.status(500).json({ error: "Server error while adding budget" });
  }
};
