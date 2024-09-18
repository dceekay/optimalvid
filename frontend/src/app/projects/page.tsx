'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  Collapse,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

// Styled Icon for Collapse
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
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await axios.get('http://localhost:5000/projects');
      setProjects(response.data);
    };
    fetchProjects();
  }, []);

  const fetchTasks = async (projectId: number) => {
    const response = await axios.get(`http://localhost:5000/projects/${projectId}/tasks`);
    setTasks({ ...tasks, [projectId]: response.data });
  };

  const handleExpandClick = (projectId: number) => {
    setExpanded(expanded === projectId ? null : projectId);
    if (!tasks[projectId]) {
      fetchTasks(projectId);
    }
  };

  const handleTaskSubmit = async (projectId: number) => {
    const response = await axios.post(`http://localhost:5000/projects/${projectId}/tasks`, newTask);
    setTasks({ ...tasks, [projectId]: [...tasks[projectId], response.data] });
    setNewTask({ title: '', description: '' });
  };

  const handleProjectSubmit = async () => {
    const response = await axios.post('http://localhost:5000/projects', newProject);
    setProjects([...projects, response.data]);
    setNewProject({ title: '', description: '' });
  };

  return (
    <Container maxWidth="md" className="container">
      {/* Header */}
      <Typography variant="h4" gutterBottom className="text-primary font-bold mt-4 text-center">
        Project Management
      </Typography>

      {/* New Project Form */}
      <Card variant="outlined" className="card-custom mb-6">
        <CardContent className="card-content-spacious">
          <Typography variant="h5" className="font-semibold text-dark mb-3">Create New Project</Typography>
          <TextField
            label="Project Title"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            fullWidth
            className="input-field"
          />
          <TextField
            label="Project Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            fullWidth
            multiline
            rows={2}
            className="input-field"
          />
          <Button
            variant="contained"
            className="button-primary"
            onClick={handleProjectSubmit}
          >
            Add Project
          </Button>
        </CardContent>
      </Card>

      {/* Projects List */}
      <Grid container spacing={4}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={6} key={project.id}>
            <Card variant="outlined" className="card-custom shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="card-content-spacious">
                <Typography variant="h5" className="font-semibold text-dark text-large">
                  {project.title}
                </Typography>
                <Typography variant="body2" className="text-secondary mt-2">
                  {project.description}
                </Typography>
              </CardContent>

              <ExpandMoreStyled
                expand={expanded === project.id}
                onClick={() => handleExpandClick(project.id)}
              >
                <ExpandMoreIcon />
              </ExpandMoreStyled>

              <Collapse in={expanded === project.id} timeout="auto" unmountOnExit className="collapse-enter collapse-exit">
                <CardContent>
                  <Typography paragraph className="text-primary">Tasks:</Typography>
                  <ul>
                    {tasks[project.id]?.map((task) => (
                      <li key={task._id}>
                        <Checkbox checked={task.status === 'completed'} />
                        {task.title} - {task.description}
                      </li>
                    ))}
                  </ul>

                  {/* New Task Form */}
                  <Typography paragraph>Create New Task:</Typography>
                  <TextField
                    label="Task Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    fullWidth
                    className="input-field"
                  />
                  <TextField
                    label="Task Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                    className="input-field"
                  />
                  <Button variant="contained" className="button-primary" onClick={() => handleTaskSubmit(project.id)}>
                    Add Task
                  </Button>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
