const express = require('express');
const router = express.Router();
const db = require('../models/Project');

// GET all projects
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM projects');
  res.json(rows);
});

// POST a new project
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  const [result] = await db.query('INSERT INTO projects (title, description) VALUES (?, ?)', [title, description]);
  res.json({ id: result.insertId, title, description });
});

module.exports = router;
