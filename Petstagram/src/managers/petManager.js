const Pet = require('../models/Pet.js')

const nameLength = 2
const age = [1, 100]
const descriptionLength = [5, 50]
const locationLength = [5, 50]

function validate(petData) {
    if(isNaN(petData.age)) {
        throw new Error('Age should be a number')
    }
    if(petData.name.length < nameLength) {
        throw new Error(`Name should be at least ${nameLength} characters long.`)
    }
    if(!petData.image.startsWith('http://') && !petData.image.startsWith('https://')) {
        throw new Error('Please provide a valid image URL')
    }
    if(Number(petData.age) < age[0] || Number(petData.age) > age[1]) {
        throw new Error(`Age should be between ${age[0]} and ${age[1]}`)
    }
    if(petData.description.length < descriptionLength[0] || petData.description.length > descriptionLength[1]) {
        throw new Error(`Description should be between ${descriptionLength[0]} and ${descriptionLength[1]} characters long.`)
    }
    if(petData.location.length < locationLength[0] || petData.location.length > locationLength[1]) {
        throw new Error(`Location should be between ${locationLength[0]} and ${locationLength[1]} characters long.`)
    }
}

exports.getPetsLean = () => Pet.find().lean().populate('owner')

exports.validateAndCreate = (petData) => {
    petData.age = Number(petData.age)
    try {
        validate(petData)

        return Pet.create(petData)
    } catch (error) {
        throw new Error(error.message)
    }
}