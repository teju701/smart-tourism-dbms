import pool from '../db/index.js';

export const getCities = async (req, res) => {
    const { search } = req.query;
    
    try {
        let query = 'SELECT * FROM cities';
        let params = [];
        
        if (search) {
            query += ' WHERE city_name ILIKE $1 OR country ILIKE $1';
            params = [`%${search}%`];
        }
        
        query += ' ORDER BY city_name LIMIT 100';
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching cities:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};