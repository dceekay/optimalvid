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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesome
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'; // Moon and Sun Icons

// Neumorphic style for expanding icon
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
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle between light and dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    } else {
      setIsDarkMode(false);
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  // Fetch all projects
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

  // Fetch tasks for a specific project
  const fetchTasks = async (projectId: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/tasks?projectId=${projectId}`);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [projectId]: response.data,
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Create a new project
  const handleProjectSubmit = async () => {
    if (newProject.title === '' || newProject.description === '') {
      alert('Please fill in both the project title and description.');
      return;
    }
    const response = await axios.post('http://localhost:5000/projects', newProject);
    setProjects([...projects, response.data]);
    setNewProject({ title: '', description: '' });
  };

  // Handle task submission
  const handleTaskSubmit = async (projectId: number) => {
    if (newTask.title === '' || newTask.description === '') {
      alert('Please fill in both the task title and description.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/tasks', {
        title: newTask.title,
        description: newTask.description,
        projectId,
      });

      setTasks((prevTasks) => ({
        ...prevTasks,
        [projectId]: [...prevTasks[projectId], response.data],
      }));
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Handle task status change
  const handleStatusChange = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

      const response = await axios.put(`http://localhost:5000/tasks/${taskId}`, {
        status: newStatus,
      });

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        Object.keys(updatedTasks).forEach((projectId) => {
          updatedTasks[projectId] = updatedTasks[projectId].map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          );
        });
        return updatedTasks;
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Confirm delete project
  const handleDeleteProject = (projectId: number) => {
    setDeleteProjectId(projectId);
    setShowDeleteDialog(true);
  };

  // Delete project and all related tasks
  const confirmDeleteProject = async () => {
    await axios.delete(`http://localhost:5000/projects/${deleteProjectId}`);
    setProjects(projects.filter((project) => project.id !== deleteProjectId));
    setShowDeleteDialog(false);
    setDeleteProjectId(null);
  };

  return (
    <Container maxWidth="lg" className="container-custom">
      <header className="header">
        <Typography variant="h4" className="toggle-heading">
          Project Manager
        </Typography>
        <IconButton onClick={toggleDarkMode}>
          <FontAwesomeIcon
            icon={isDarkMode ? faSun : faMoon}
            style={{ color: isDarkMode ? '#FFD700' : '#4C5DF1', fontSize: '1.5rem' }}
          />
        </IconButton>
      </header>

      <Typography variant="h5" gutterBottom className="toggle-heading">
        Projects
      </Typography>

      <Grid container spacing={4}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card variant="outlined" className="card-custom">
              <CardContent>
                <Typography variant="h6" className="toggle-heading">
                  {project.title}
                </Typography>
                <Typography variant="body2" className="toggle-text">
                  {project.description}
                </Typography>
              </CardContent>

              <IconButton onClick={() => handleDeleteProject(project.id)}>
                <DeleteIcon />
              </IconButton>

              <ExpandMoreStyled expand={expanded === project.id} onClick={() => handleExpandClick(project.id)}>
                <ExpandMoreIcon />
              </ExpandMoreStyled>

              <Collapse in={expanded === project.id} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph className="toggle-heading">Tasks:</Typography>
                  <ul>
                    {tasks[project.id]?.map((task) => (
                      <li key={task._id} className="flex items-center">
                        <Checkbox
                          checked={task.status === 'completed'}
                          onChange={() => handleStatusChange(task._id, task.status)}
                        />
                        <span className={task.status === 'completed' ? 'line-through' : 'toggle-text'}>
                          {task.title} - {task.description}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Typography paragraph className="toggle-heading">Create New Task:</Typography>
                  <TextField
                    label="Task Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    fullWidth
                    className="toggle-input"
                  />
                  <TextField
                    label="Task Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                    className="mt-2 toggle-input"
                  />
                  <Button variant="contained" onClick={() => handleTaskSubmit(project.id)} className="mt-2">
                    Add Task
                  </Button>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* New Project Form */}
      <div style={{ marginTop: '20px' }}>
        <Typography variant="h5" className="toggle-heading">Create New Project</Typography>
        <form className="new-project-form">
          <TextField
            label="Project Title"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            fullWidth
            className="mt-2 toggle-input"
          />
          <TextField
            label="Project Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            fullWidth
            multiline
            rows={2}
            className="mt-2 toggle-input"
          />
          <Button variant="contained" onClick={handleProjectSubmit} className="button-primary">
            Add Project
          </Button>
        </form>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this project and all its tasks?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDeleteProject}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
