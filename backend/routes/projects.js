const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Task = require('../models/Task'); 

// Get all projects
router.get('/', async (req, res) => {
  try {
    const [projects] = await db.query('SELECT * FROM projects');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

// POST /projects - Create a New Project
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  

  if (!title || !description) {
    return res.status(400).json({ message: 'Project title and description are required.' });
  }
  
  try {
    const query = 'INSERT INTO projects (title, description) VALUES (?, ?)';
    const [result] = await db.query(query, [title, description]);
    res.status(201).json({ id: result.insertId, title, description });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  try {
    const query = 'UPDATE projects SET title = ?, description = ? WHERE id = ?';
    await db.query(query, [title, description, id]);
    res.status(200).json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error });
  }
});

// Delete a project and associated tasks
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the project from MySQL
    await db.query('DELETE FROM projects WHERE id = ?', [id]);

    // Delete all related tasks from MongoDB
    await Task.deleteMany({ projectId: String(id) }); // Ensure projectId matches as a string

    res.status(200).json({ message: 'Project and associated tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project and tasks', error });
  }
});

// GET /projects/:id/tasks 
router.get('/:id/tasks', async (req, res) => {
  const { id: projectId } = req.params;

  try {
    const tasks = await Task.find({ projectId: String(projectId) });
    if (!tasks.length) {
      return res.status(404).json({ message: 'No tasks found for this project.' });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

// POST /projects/:id/tasks - Create a new task under a project
router.post('/:id/tasks', async (req, res) => {
  const { title, description, dueDate } = req.body;
  const { id: projectId } = req.params;

  if (!title || !description) {
    return res.status(400).json({ message: 'Task title and description are required.' });
  }

  try {
    const task = new Task({ title, description, dueDate, projectId: String(projectId) });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
});

// PUT /tasks/:id - Update an existing task
router.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;

  if (!title || !description || !status) {
    return res.status(400).json({ message: 'Title, description, and status are required.' });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status, dueDate }, 
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

// DELETE /tasks/:id - Delete a task
router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
});

module.exports = router;
