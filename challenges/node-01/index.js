const express = require('express');

const server = express();
server.use(express.json());

let TOTAL_REQUESTS = 0; // counting how many requests were made
const projects = []; // array to store projects and tasks

function countRequest(req, res, next) {
  TOTAL_REQUESTS += 1;
  console.log(`Requests: ${TOTAL_REQUESTS}`);
  return next();
}

function checkProjectExists(id) {
  if (id === undefined || id === null) return false;
  return projects.some(p => p.id === id);
}

function handleDeleteProject(req, res, next) {
  const { id } = req.params;

  if (!checkProjectExists(id)) return res.status(400).json({ error: 'Project not found.' });

  return next();
}

function handleUpdateProject(req, res, next) {
  const { id } = req.params;
  const { title } = req.body;

  if (!checkProjectExists(id)) return res.status(400).json({ error: 'Project not found.' });
  if (!title) return res.status(400).json({ error: 'Project title is required.' });

  return next();
}

function handleCreateProject(req, res, next) {
  const { id, title } = req.body;
  if (!id) return res.status(400).json({ error: 'Project id is required.' });
  if (!title) return res.status(400).json({ error: 'Project title is required.' });
  if (checkProjectExists(id)) res.status(400).json({ error: 'Project already exists.' });

  req.project = {
    id,
    title,
    tasks: [],
  };

  return next();
}

function handleUpdateProjectTasks(req, res, next) {
  const { id } = req.params;
  const { title } = req.body;

  if (!checkProjectExists(id)) return res.status(400).json({ error: 'Project not found.' });
  if (!title) return res.status(400).json({ error: 'Task title is required.' });

  return next();
}

server.use(countRequest);

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', handleCreateProject, (req, res) => {
  const { project } = req;
  projects.push(project);
  return res.json(projects);
});

server.put('/projects/:id', handleUpdateProject, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  project.title = title;
  return res.json(project);
});

server.delete('/projects/:id', handleDeleteProject, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id === id);
  projects.splice(projectIndex, 1);
  return res.json(projects);
});

server.post('/projects/:id/tasks', handleUpdateProjectTasks, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);
  project.tasks.push(title);
  return res.json(project);
});

server.listen(3000);
