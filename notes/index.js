require('dotenv').config()
const express = require('express')
const Note = require('./models/note')
const process = require('process')
const note = require('./models/note')
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.static('dist'))
app.use(express.json())

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id

  Note.findById(id).then(note => {
    if (note)
      return response.json(note)
    response.status(404).end()
  })
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body || !body.content) {
    return response.status(400).json({
      error: "content missing"
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  
  Note.findByIdAndDelete(id).then(deletedNote => 
    response.status(204).end()
  )
})

app.use((request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}) 

app.listen(PORT, () => {
    console.log(`The server is running on 'http://localhost:${PORT}'`)
})