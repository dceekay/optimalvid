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

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      const response = await axios.get('http://localhost:5000/projects');
      setProjects(response.data);
    };
    fetchProjects();
  }, []);

  // Handle expanding project tasks
  const handleExpandClick = (projectId: number) => {
    setExpanded(expanded === projectId ? null : projectId);
    if (!tasks[projectId]) {
      fetchTasks(projectId);
    }
  };

  // Fetch tasks for a specific project
  const fetchTasks = async (projectId: number) => {
    const response = await axios.get(`http://localhost:5000/projects/${projectId}/tasks`);
    setTasks({ ...tasks, [projectId]: response.data });
  };

  // Create a new project with validation
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
    const response = await axios.post(`http://localhost:5000/projects/${projectId}/tasks`, newTask);
    setTasks({ ...tasks, [projectId]: [...tasks[projectId], response.data] });
    setNewTask({ title: '', description: '' });
  };

  // Confirm deletion of project
  const handleDeleteProject = (projectId: number) => {
    setDeleteProjectId(projectId);
    setShowDeleteDialog(true);
  };

  // Delete project and its tasks
  const confirmDeleteProject = async () => {
    await axios.delete(`http://localhost:5000/projects/${deleteProjectId}`);
    setProjects(projects.filter((project) => project.id !== deleteProjectId));
    setShowDeleteDialog(false);
    setDeleteProjectId(null);
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

              <IconButton onClick={() => handleDeleteProject(project.id)}>
                <DeleteIcon />
              </IconButton>

              <ExpandMoreStyled
                expand={expanded === project.id}
                onClick={() => handleExpandClick(project.id)}
              >
                <ExpandMoreIcon />
              </ExpandMoreStyled>

              <Collapse in={expanded === project.id} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph>Tasks:</Typography>
                  <ul>
                    {tasks[project.id]?.map((task) => (
                      <li key={task._id}>
                        <Checkbox checked={task.status === 'completed'} />
                        {task.title} - {task.description}
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
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* New Project Form */}
      <div style={{ marginTop: '20px' }}>
        <Typography variant="h5">Create New Project</Typography>
        <TextField
          label="Project Title"
          value={newProject.title}
          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
          fullWidth
          className="mt-2"
        />
        <TextField
          label="Project Description"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          fullWidth
          multiline
          rows={2}
          className="mt-2"
        />
        <Button variant="contained" onClick={handleProjectSubmit} className="mt-2">
          Add Project
        </Button>
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
