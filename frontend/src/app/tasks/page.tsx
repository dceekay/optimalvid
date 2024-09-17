'use client';

import { Container, Typography, TextField, Button, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

export default function TaskManagementPage({ projectId }: { projectId: number }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tasks/${projectId}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [projectId]);

  const handleAddTask = async () => {
    if (newTask.title && newTask.description) {
      try {
        const response = await axios.post(`http://localhost:5000/tasks/${projectId}`, newTask);
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '' });
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    try {
      const task = tasks.find(task => task.id === taskId);
      await axios.put(`http://localhost:5000/tasks/${taskId}`, { completed: !task.completed });
      setTasks(tasks.map(task => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <Container maxWidth="md" className="mt-8">
      <Typography variant="h4" gutterBottom className="text-center text-blue-600 font-bold">
        Task Management
      </Typography>

      {/* Add new task */}
      <TextField
        label="Task Title"
        variant="outlined"
        fullWidth
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        className="mb-4"
      />
      <TextField
        label="Task Description"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        className="mb-4"
      />
      <Button variant="contained" color="primary" onClick={handleAddTask}>
        Add Task
      </Button>

      {/* Task list */}
      <List className="mt-4">
        {tasks.map((task) => (
          <ListItem key={task.id} className="flex items-center justify-between">
            <ListItemText
              primary={task.title}
              secondary={task.description}
              className={task.completed ? 'line-through text-green-500' : ''}
            />
            <div>
              <IconButton onClick={() => handleToggleComplete(task.id)}>
                <CheckIcon color={task.completed ? 'success' : 'inherit'} />
              </IconButton>
              <IconButton onClick={() => handleDeleteTask(task.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
