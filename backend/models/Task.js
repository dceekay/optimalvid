const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
  projectId: Number,
});

module.exports = mongoose.model('Task', taskSchema);
