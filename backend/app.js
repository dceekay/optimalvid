const express = require('express');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const db = require('./config/db');
const Task = require('./models/Task');

const app = express();
app.use(express.json());

app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);


if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
