const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    commentList: [
        {
            user: {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            },
            comment: String
        }
    ],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Pet = mongoose.model('Pet', petSchema)

module.exports = Pet