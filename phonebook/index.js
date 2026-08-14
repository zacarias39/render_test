require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person  = require('./models/phonebook')
const app = express()
const PORT = process.env.PORT | 3001

let persons = [
    { 
      "id": "2",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// This is a middleWare for logging user request along with its path and method
/*
app.use((req, res, next) => {
    console.log("Method", req.method)
    console.log("Path", req.path)
    console.log("Body", req.body)
    console.log("----------")
    next()
})*/

app.get('/api/info', (req, res) => {
    const date = new Date();

    Person.find({}).then(persons => {
        res.send(`
            <p>Phonebook has info for ${persons.length} peoples<p>
            <p>${date.toString()}<p>
        `)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id

    Person.findById(id).then(person => {
        console.log(person)
        if (person)
            return res.json(person).end()
        return res.status(404).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const number = req.body.number.trim()
    const name = req.body.name.trim()

    if (!req.body || !name || !number) {
        return res.status(400).json({
            error: "The name or number is missing"
        }).end()
    }

    Person.find({}).then(persons => {
        
        if (persons.find(n => n.name === name)) {
            return res.status(400).json({
                error: "The name already exists in the phonebook"
            }).end()
        }
    })
    .catch(error => next(error))

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(person => {
        res.json(person)
    }).catch(error => {
        console.err('person not saved')
        res.status(400).json({
            error: "person not saved"
        }).end()
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const number = req.body.number.trim()

    if (!req.body || !number) {
        return res.status(400).json({
            error: "The number is missing"
        }).end()
    }

    Person.findById(id).then(person => {
        if (!person)
            return res.status(404).end()
        console.log(number)
        person.number = number
        return person.save().then(person => {
            res.json(person)
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id

    Person.findByIdAndDelete(id).then(deletedPerson => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({
        error: "unknown endpoint"
    }).end()
}

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name == 'CastError')
        return res.status(400).send({ error: 'malformatted id'})
    next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`the server is running on 'http://localhost:${PORT}'`)
})
