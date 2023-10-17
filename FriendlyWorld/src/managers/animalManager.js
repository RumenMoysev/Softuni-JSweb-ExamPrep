const Animal = require('../models/Animal.js')

const nameLength = 2
const kindLength = 3
const needLength = [3, 20]
const descriptionLength = [5, 50]
const locationLength = [5, 15]

function validate(animalData) {
    const {name, years, kind, image, need, location, description} = animalData

    if(name.length < nameLength) {
        throw new Error(`Name should be at least ${nameLength} characters long`)
    }
    if(years < 1 || years > 100) {
        throw new Error(`Years should be at between 1 and 100`)
    }
    if(kind.length < kindLength) {
        throw new Error(`Kind should be at least ${kindLength} characters long`)
    }
    if(!image.startsWith('http://') && !image.startsWith('https://')) {
        throw new Error('Please provide a valid image URL')
    }
    if(need.length < needLength[0] || need.length > needLength[1]) {
        throw new Error(`Need should be at between ${needLength[0]} and ${needLength[1]} characters long`)
    }
    if (location.length < locationLength[0] || location.length > locationLength[1]) {
        throw new Error(`Location should be at between ${locationLength[0]} and ${locationLength[1]} characters long`)
    }
    if (description.length < descriptionLength[0] || description.length > descriptionLength[1]) {
        throw new Error(`Description should be at between ${descriptionLength[0]} and ${descriptionLength[1]} characters long`)
    }
}

exports.getAnimalsLean = () => Animal.find().lean()

exports.validateAndCreate = (animalData) => {
    try {
        validate(animalData)

        return Animal.create(animalData)
    } catch (error) {
        throw new Error(error.message)
    }
}

exports.getAnimalByIdLean = async (id) => {
    const animal = await Animal.findById(id).lean()

    if(animal) {
        return animal
    } else {
        throw new Error('Animal does not exist')
    }
}

exports.validateAndUpdate = (animalData, id) => {
    try {
        validate(animalData)

        return Animal.findByIdAndUpdate(id, animalData)
    } catch (error) {
        throw new Error(error.message)
    }
}

exports.deleteAnimal = (id) => {
    try {
        return Animal.findByIdAndDelete(id)
    } catch (error) {
        throw new Error('animal does not exist')
    }
}

exports.donateForAnimal = async (animalId, userId) => {
    const animal = await Animal.findById(animalId)
    animal.donations.push(userId)
    return animal.save()
}

exports.searchByLocation = async (location) => {
    const animals = await Animal.find().lean()

    const foundAnimals = animals.filter(x => x.location.toLowerCase() === location.toLowerCase())
    return foundAnimals
}