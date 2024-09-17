const mysql = require('mysql2/promise');

// Create a connection pool for MySQL
const db = mysql.createPool({
  host: 'localhost',      // XAMPP MySQL runs on localhost
  user: 'root',           // Default XAMPP MySQL username
  password: '',           // Default password is empty for root user
  database: 'project_management', // Your database name (ensure it's created in XAMPP)
  waitForConnections: true,
  connectionLimit: 10,    // Adjust pool size as needed
  queueLimit: 0
});

module.exports = db;
