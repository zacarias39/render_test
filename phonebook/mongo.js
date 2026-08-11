const mongoose = require('mongoose')

if (process.argv.length != 3 && process.argv.length != 5) {
        console.error("Missing some paramenters: ")
        console.error("usage for reading the notes: node mongo.js <Passoword>")
        console.error("usage for adding a note: node mongo.js <Passoword> <Name> <Number>")
        process.exit()
}

const passWord = process.argv[2];
const url = `mongodb+srv://zacariasnatxo39_db_user:${passWord}@cluster0.2qxpgrk.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = mongoose.Schema({
        name: String,
        number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {

        console.log("phonebook: ")

        Person.find({ }).then(result => {
                result.forEach(person => {
                       console.log(person)
                })
                mongoose.connection.close()
        })
} else {
        const name = process.argv[3]
        const number = process.argv[4]

        const person = new Person({
                name: name,
                number: number,
        })

        person.save().then(res => {
                console.log(`added ${name} number ${number} to phonebook`)
                mongoose.connection.close()
        })
}

