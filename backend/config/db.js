const mysql = require('mysql2/promise');

// Create MySQL connection pool
const db = mysql.createPool({
  host: 'localhost',       
  user: 'root',            
  password: '',            
  database: 'project_management',  
});

module.exports = db;
