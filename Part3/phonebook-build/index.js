require('dotenv').config()
const express = require('express')
const PhoneNumber = require('./model/phonenumber')

const app = express()
app.use(express.json())
app.use(express.static('build'))

const getPersons = () => PhoneNumber.find({})

const getPersonById = (id) => PhoneNumber.findById(id)

const updatePersonById = (id, newPerson) => {
    const opts = {
        runValidators: true,
        new: true,
    }
    return PhoneNumber.findByIdAndUpdate(id, newPerson, opts)
}

app.get('/api/persons', async (request, response, next) => {
    try {
        response.json(await getPersons())
    } catch (err) {
        next(err)
    }
})

app.get('/api/persons/:id', async (request, response, next) => {
    const { id } = request.params
    try {
        const person = await getPersonById(id)
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

app.get('/info', async (request, response, next) => {
    try {
        const persons = await getPersons()
        response.send(`<p>Phonebook has info for ${persons.length} people</p>
<p>${new Date()}</p> `)
    } catch (err) {
        next(err)
    }
})

app.post('/api/persons', async (request, response, next) => {
    try {
        const { body } = request
        if (!body) {
            response.status(400).json({
                error: 'Content missing',
            })
            return
        }

        const duplicatePerson = await PhoneNumber.findOne({ name: body.name })
        if (duplicatePerson) {
            response.status(400).json({
                error: 'Name must be unique',
            })
            return
        }

        const person = PhoneNumber({
            name: body.name,
            number: body.number,
        })

        const returnedPerson = await person.save()
        response.status(201).json(returnedPerson)
    } catch (err) {
        next(err)
    }
})

app.put('/api/persons/:id', async (request, response, next) => {
    const { id } = request.params
    const { body } = request

    const phonenumber = {
        name: body.name,
        number: body.number,
    }

    try {
        const newPhoneNumber = await updatePersonById(id, phonenumber)
        response.json(newPhoneNumber)
    } catch (err) {
        next(err)
    }
})

app.delete('/api/persons/:id', async (request, response, next) => {
    const { id } = request.params
    try {
        await PhoneNumber.findByIdAndDelete(id)
        response.status(204).end()
    } catch (err) {
        next(err)
    }
})

const errorHandler = (err, request, response, next) => {
    // console.error(err.message)

    if (err.name === 'CastError') {
        response.status(400).json({ error: 'malformatted id' })
        return
    }

    if (err.name === 'ValidationError') {
        response.status(400).json({ error: err.message })
        return
    }

    next(err)
}

app.use(errorHandler)

// start listening to PORT
const PORT = process.env.PORT || 3001
app.listen(PORT)
// console.log(`Listening to port ${PORT}`)
