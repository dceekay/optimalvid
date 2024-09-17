const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();

// Connect to MongoDB (corrected syntax, removed deprecated options)
mongoose.connect('mongodb://localhost:27017/project_management');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

// Server listening
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
