'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, TextField, Button, Checkbox, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';


const ExpandMoreStyled = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await axios.get('http://localhost:5000/projects');
      setProjects(response.data);
    };
    fetchProjects();
  }, []);

  const handleExpandClick = (projectId: number) => {
    setExpanded(expanded === projectId ? null : projectId);
    if (!tasks[projectId]) {
      fetchTasks(projectId);
    }
  };

  const fetchTasks = async (projectId: number) => {
    const response = await axios.get(`http://localhost:5000/projects/${projectId}/tasks`);
    setTasks({ ...tasks, [projectId]: response.data });
  };

  const handleTaskSubmit = async (projectId: number) => {
    const response = await axios.post(`http://localhost:5000/projects/${projectId}/tasks`, newTask);
    setTasks({ ...tasks, [projectId]: [...tasks[projectId], response.data] });
    setNewTask({ title: '', description: '' });
  };

  const handleTaskUpdate = async (taskId: string, updatedTask: any) => {
    await axios.put(`http://localhost:5000/tasks/${taskId}`, updatedTask);
    fetchTasks(expanded);
  };

  const handleTaskDelete = async (taskId: string) => {
    await axios.delete(`http://localhost:5000/tasks/${taskId}`);
    fetchTasks(expanded);
  };

  const toggleTaskCompletion = (task: any) => {
    const updatedTask = { ...task, status: task.status === 'completed' ? 'pending' : 'completed' };
    handleTaskUpdate(task._id, updatedTask);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <Grid container spacing={4}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5">{project.title}</Typography>
                <Typography variant="body2">{project.description}</Typography>
              </CardContent>

              <ExpandMoreStyled
                expand={expanded === project.id}
                onClick={() => handleExpandClick(project.id)}
              >
                <ExpandMoreIcon />
              </ExpandMoreStyled>

              <CardContent>
                <Collapse in={expanded === project.id} timeout="auto" unmountOnExit>
                  <Typography paragraph>Tasks:</Typography>
                  <ul>
                    {tasks[project.id]?.map((task) => (
                      <li key={task._id}>
                        <Checkbox
                          checked={task.status === 'completed'}
                          onChange={() => toggleTaskCompletion(task)}
                        />
                        <TextField
                          value={task.title}
                          onChange={(e) => handleTaskUpdate(task._id, { ...task, title: e.target.value })}
                        />
                        <TextField
                          value={task.description}
                          onChange={(e) => handleTaskUpdate(task._id, { ...task, description: e.target.value })}
                          fullWidth
                          multiline
                          rows={2}
                          className="mt-2"
                        />
                        <IconButton onClick={() => handleTaskDelete(task._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </li>
                    ))}
                  </ul>

                  <Typography paragraph>Create New Task:</Typography>
                  <TextField
                    label="Task Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Task Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                    className="mt-2"
                  />
                  <Button variant="contained" onClick={() => handleTaskSubmit(project.id)} className="mt-2">
                    Add Task
                  </Button>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
