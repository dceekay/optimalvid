// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');  


router.post('/projects/:projectId/tasks', async (req, res) => {
  const { title, description, dueDate } = req.body;
  const { projectId } = req.params;

  try {
    const task = new Task({ title, description, dueDate, projectId });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
});


router.get('/projects/:projectId/tasks', async (req, res) => {
  const { projectId } = req.params;

  try {
    const tasks = await Task.find({ projectId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});


router.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, { title, description, status, dueDate }, { new: true });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

// DELETE: Delete a task
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
