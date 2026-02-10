import pkg from 'pg'
import dotenv from 'dotenv'
dotenv.config();

const { Pool } = pkg;

const pool = new Pool(
    {
        user:process.env.DB_USER,
        password:process.env.DB_PASS,
        port: process.env.DB_PORT,
        database:process.env.DB_NAME,
        host: process.env.DB_HOST
    }
);

export default pool;
