const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  projectId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'pending' },
  dueDate: { type: Date },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
