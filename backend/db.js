import pkg from "pg";
const { Pool } = pkg;
import 'dotenv/config';
// this almost gave me a heart attack when it wasnt working, but its fixed now -R

const pool = new Pool(
    process.env.DATABASE_URL ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    } : {
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
    }
);

const initDB = async () => {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS todo (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT false
      );
    `);
        console.log("Todos table ready");
    } catch (err) {
        console.error("DB init failed:", err);
    }
};

initDB();

export default pool;