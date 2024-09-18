const express = require('express');
const router = express.Router();
const db = require('../config/db'); // MySQL connection

// Get all projects
router.get('/', async (req, res) => {
  try {
    const [projects] = await db.query('SELECT * FROM projects');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

// Add a new project
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  try {
    const query = 'INSERT INTO projects (title, description) VALUES (?, ?)';
    const [result] = await db.query(query, [title, description]);
    res.status(201).json({ id: result.insertId, title, description });
  } catch (error) {
    res.status(500).json({ message: 'Error adding project', error });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const query = 'UPDATE projects SET title = ?, description = ? WHERE id = ?';
    await db.query(query, [title, description, id]);
    res.status(200).json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM projects WHERE id = ?';
    await db.query(query, [id]);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
});

module.exports = router;
