const mongoose = require('mongoose')

const username = process.env.MONGODB_USERNAME
const password = encodeURIComponent(process.env.MONGODB_PASSWORD)
const cluster = process.env.MONGODB_CLUSTER

const url = `mongodb+srv://${username}:${password}@${cluster}/phonebookApp?retryWrites=true&w=majority`

console.log('trying to connect to ', url)

mongoose
    .connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('connection error ', error)
    })

const phonenumberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'No name entered'],
        minLength: [3, 'Name must be at least 3 letters long'],
    },
    number: {
        type: String,
        required: [true, 'No number entered'],
        minLength: [8, 'Number must be at least 8 characters long'],
        match: [/^(\d{2,3}-)?\d*$/, "If separated by an '-', the left side must have 2-3 digits and the right side must also be digits"]
    },
})

phonenumberSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
    }
})

const PhoneNumber = mongoose.model('PhoneNumber', phonenumberSchema)

module.exports = PhoneNumber

