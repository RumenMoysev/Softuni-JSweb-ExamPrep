const Game = require('../models/Game.js')

const platform = ['PC', 'Nintendo', 'PS4', 'PS5', 'XBOX']
const nameLength = 4
const genreLength = 2
const descriptionLength = 10

function validate(data) {
    if(!platform.includes(data.platform)) {
        throw new Error('Platform is not supported')
    }
    if(data.name.length < nameLength) {
        throw new Error(`Name should be at least ${nameLength} characters long`)
    } 
    if(!data.image.startsWith('http://') && !data.image.startsWith('https://')) {
        throw new Error('Please provide a valid link')
    }
    if(Number(data.price) < 0) {
        throw new Error('Price should be a positive number')
    }
    if(data.genre.length < genreLength) {
        throw new Error(`Genre should be at least ${genreLength} characters long`)
    }
    if(data.description.length < descriptionLength) {
        throw new Error(`Description should be at least ${descriptionLength} characters long`)
    }

    return true
}

exports.validateAndCreate = (data) => {
    try {
        validate(data)
        return Game.create(data)
    } catch (err) {
        throw new Error(err.message)
    }
}

exports.getGamesLean = ()   => Game.find().lean()