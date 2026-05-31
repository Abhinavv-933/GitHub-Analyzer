const mysql2 = require('mysql2/promise');

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // <-- add this
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const connectDB = async () => {
  const connection = await pool.getConnection();
  console.log("✅ DB Connected");
  connection.release();
};

module.exports = { pool, connectDB };