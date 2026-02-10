import pool from '../db/index.js';
import dotenv from 'dotenv';
dotenv.config();

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

export const register = async (req, res) => {
    const { name, email, password, budget } = req.body;
    
    console.log("REGISTER BODY:", req.body);

    try {
        // Check if user already exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }
        
        // Insert new user (in production, hash the password!)
        const result = await pool.query(
            'INSERT INTO users (name, email, password, budget) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, budget',
            [name, email, password, budget]
        );
        
        res.json({
            user_id: result.rows[0].user_id,
            name: result.rows[0].name,
            email: result.rows[0].email,
            budget: result.rows[0].budget,
            message: 'Registration successful'
        });
    } catch (err) {
        console.error("Error registering user:", err.message);
        res.status(500).json({ error: "Registration failed: " + err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Find user by email and password (in production, compare hashed passwords!)
        const result = await pool.query(
            'SELECT user_id, name, email, budget FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        res.json({
            user_id: result.rows[0].user_id,
            name: result.rows[0].name,
            email: result.rows[0].email,
            budget: result.rows[0].budget,
            message: 'Login successful'
        });
    } catch (err) {
        console.error("Error logging in:", err.message);
        res.status(500).json({ error: "Login failed: " + err.message });
    }
};

export const adminLogin = async (req, res) => {
    const { email, password, adminKey } = req.body;
    console.log("ADMIN LOGIN BODY:", req.body);
    console.log("ENV ADMIN KEY:", ADMIN_SECRET_KEY);

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }

    try {
        // Step 1: Validate normal user login
        const result = await pool.query(
            'SELECT user_id, name, email, budget, is_admin FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0];

        // Step 2: If user is already admin in DB → allow admin login
        if (user.is_admin === true) {
            return res.json({
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                budget: user.budget,
                is_admin: true,
                adminKey: ADMIN_SECRET_KEY, // ✅ FIXED: Send adminKey back to frontend
                message: "Admin login successful"
            });
        }

        // Step 3: Otherwise adminKey MUST match
        if (!adminKey || adminKey !== ADMIN_SECRET_KEY) {
            return res.status(403).json({ error: "Invalid admin secret key" });
        }

        // Step 4: Mark admin for this session (does NOT update DB)
        return res.json({
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            budget: user.budget,
            is_admin: true,
            adminKey: ADMIN_SECRET_KEY, // ✅ FIXED: Send adminKey back to frontend
            message: "Admin login successful"
        });

    } catch (err) {
        console.error("Admin login error:", err.message);
        res.status(500).json({ error: "Admin login failed: " + err.message });
    }
};