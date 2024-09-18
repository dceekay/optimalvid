// app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// MySQL connection
const db = require('./config/db'); // MySQL connection for projects

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/project_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');  


app.use('/projects', projectRoutes);

app.use('/tasks', taskRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
