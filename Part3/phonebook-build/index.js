const express = require('express')
const app = express()
//const morgan = require('morgan')

app.use(express.json())
app.use(express.static('build'))

//morgan.token('data', (req, res) => {
//  if (req.method === "POST")
//    return JSON.stringify(req.body)
//  else
//    return ""
//})
//
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (persons) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  response.send(`
     <p>Phonebook has info for ${persons.length} people</p>
     <p>${new Date()}</p>
  `)
})

const genID = () => {
  return Math.floor(Math.random()*1000000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.some(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: genID(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(n => n.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log(`Listening to port ${PORT}`)
