const mongoose = require('mongoose')
const uri = process.env.MONGODB_URI

mongoose.set('strictQuery', false);

mongoose.connect(uri, { family: 4 }).then(res => {
        console.log('Connected to MongoDB')
}).catch(error => {
        console.err('Error Connecting to MongoDB: ', error.message)
})

const personSchema = mongoose.Schema({
      name: String,
      number: String
})

personSchema.set('toJSON', {
        transform: (document, returnedObj) => {
                returnedObj.id = returnedObj._id
                delete returnedObj._id
                delete returnedObj.__v
        }
})

module.exports = mongoose.model("Person", personSchema)