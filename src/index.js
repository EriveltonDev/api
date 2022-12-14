const { request } = require('express');
const express = require('express')
const { v4 } = require('uuid');
const { isUuid } = require('uuidv4');

const app = express()
app.use(express.json())
const porta = 3333;

const projects = [];

function logRequest (request, response, next) {
  const {method, url} = request;

  console.log(method, url)

  return next()
}

function validateId(request, response, next) {
  const {id} = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({error: 'Invalid ID'})
  }

  return next()
}

app.use(logRequest)

app.get('/projects', logRequest, (request, response) => {
  const {title} = request.query;

  const results = title 
  ? projects.filter(project => project.title.includes(title))
  : projects;

  return response.json(results)
})

app.post('/projects', (request, response) => {
  const {title, owner } = request.body;

  const project = {
    id: v4(),
    title,
    owner
  }

  projects.push(project)

  return response.json(project)
})

app.put('/projects/:id', validateId ,(request, response) => {
  const {id} = request.params;
  const {title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(404).json({error: 'Project not found'})
  }

  const project = {
    id,
    title,
    owner
  }

  projects[projectIndex] = project;

  return response.json(project)
})

app.delete('/projects/:id',validateId ,(request, response) => {
  const {id} = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(404).json({error: 'Project not found'})
  }

  projects.splice(projectIndex, 1)

  return response.status(204).send()
})



app.listen(porta, () => {
  console.log(`O servidor está rodando na porta ${porta}`)
})