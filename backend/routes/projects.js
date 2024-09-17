const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Get all projects
router.get('/', async (req, res) => {
  try {
    const [projects] = await db.query('SELECT * FROM projects');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

module.exports = router;
