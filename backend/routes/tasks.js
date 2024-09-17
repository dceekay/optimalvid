const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks for a project
router.get('/:projectId', async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.projectId });
  res.json(tasks);
});

// POST a new task
router.post('/:projectId', async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({ title, description, completed: false, projectId: req.params.projectId });
  await task.save();
  res.json(task);
});

module.exports = router;
