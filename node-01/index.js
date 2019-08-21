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

function checkProjectBody(req, res, next) {
  const { id, title } = req.body;
  if (!id) return res.status(400).json({ error: 'Project id is required.' });
  if (!title) return res.status(400).json({ error: 'Project title is required.' });

  req.project = {
    id,
    title,
    tasks: [],
  };

  return next();
}

server.use(countRequest);

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', checkProjectBody, (req, res) => {
  const { project } = req;
  projects.push(project);
  return res.json(projects);
});

server.post('/projects/:id/tasks', checkProjectBody, (req, res) => {
  const { project } = req;
  projects.push(project);
  return res.json(projects);
});

server.listen(3000);
