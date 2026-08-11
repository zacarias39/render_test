require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person  = require('./models/phonebook')
const app = express()
const PORT = process.env.PORT | 3001

let persons = [
    { 
      "id": "1",
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

app.use(express.json())
app.use(express.static('dist'))

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
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id

    Person.findById(id).then(person => {
        console.log(person)
        if (person)
            return res.json(person).end()
        return res.status(404).end()
    }).catch(error => {
        return res.status(404).end()
    })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body || !body.name || !body.number) {
        return res.status(400).json({
            error: "The name or number is missing"
        }).end()
    }

    Person.find({}).then(persons => {
        if (persons.find(n => n.name === body.name.trim())) {
            return res.status(400).json({
                error: "The name already exists in the phonebook"
            }).end()
        }
    })

    const person = new Person({
        id: Math.random().toString(36).substring(2, 13),
        name: body.name.trim(),
        number: body.number
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

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id

    Person.findByIdAndDelete(id).then(deletedPerson => {
        res.status(204).end()
    })
})

app.use((req, res) => {
    res.status(404).send({
        error: "unknown endpoint"
    }).end()
})

app.listen(PORT, () => {
    console.log(`the server is running on 'http://localhost:${PORT}'`)
})
