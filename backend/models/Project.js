const mysql = require('mysql2/promise');

// Create a connection pool for MySQL
const db = mysql.createPool({
  host: 'localhost',      // XAMPP MySQL runs on localhost
  user: 'root',           // Default MySQL username
  password: '',           // Default password is empty for root user
  database: 'project_management', // Your database name 
  waitForConnections: true,
  connectionLimit: 10,   
  queueLimit: 0
});

module.exports = db;
