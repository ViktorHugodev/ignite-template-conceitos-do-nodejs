const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
  const user = users.find(user => user.username === username)
  if (!user) return response.status(404).json({
    error: 'User not found'
  })
  request.user = user
  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body
  const alreadyExists = users.some(user => user.username === username)
  if (alreadyExists) return response.status(400).json({
    error: 'Usuer already exists'
  })
  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  users.push(newUser)
  return response.status(201).json(newUser)
  // Complete aqui
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers
  const user = users.find(user => user.username === username)

  return response.status(201).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { title, deadline } = request.body
  const newPost = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(newPost)
  return response.status(201).json(newPost)
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { id } = request.params
  const { title, deadline } = request.body
  const task = user.todos.find(task => task.id === id)
  if(!task) return response.status(404).json({error: 'Task does not exists'})
  task.title = title
  task.deadline = new Date(deadline)

  return response.status(201).json(task)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { id } = request.params
  const task = user.todos.find(task => task.id === id)
  if(!task) return response.status(404).json({error: 'Task does not exists'})
  task.done = true
  return response.status(201).json(task)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { id } = request.params
  const task = user.todos.find(task => task.id === id)
  if(!task) return response.status(404).json({error: 'Task does not exists'})
  user.todos.splice(task, 1)

  return response.status(204).send()
  // Complete aqui
});

module.exports = app;