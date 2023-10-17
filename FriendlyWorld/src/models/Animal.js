const mongoose = require('mongoose')

const animalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    years: {
        type: Number,
        required: true
    },
    kind: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    need: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    donations: [
        {
            type: mongoose.Types.ObjectId
        }
    ],
    onwer: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Animal = mongoose.model('Animal', animalSchema)

module.exports = Animal