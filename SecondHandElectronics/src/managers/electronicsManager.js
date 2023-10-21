const Electronic = require('../models/Electronic.js')

const nameLength = 10
const typeLength = 2
const damagesLength = 10
const descriptionLength = [10, 200]

function validate(data) {
    if(data.name.length < nameLength) {
        throw new Error(`Name should be at least ${nameLength} characters long!`)
    }
    if(data.type.length < typeLength) {
        throw new Error(`Type should be at least ${typeLength} characters long!`)
    }
    if (isNaN(data.production) || Number(data.production) < 1900 || Number(data.production) > 2023) {
        throw new Error('Production should be between the year 1900 and 2023')
    }
    if (isNaN(data.exploitation) || Number(data.exploitation) <= 0) {
        throw new Error('Exploitation should be a positive number')
    }
    if(data.damages.length < damagesLength) {
        throw new Error(`Damages should be at least ${damagesLength} characters long!`)
    }
    if(!data.image.startsWith('http://') && !data.image.startsWith('https://')) {
        throw new Error('Please provide a valid image Url!')
    }
    if(data.description.length < descriptionLength[0] || data.description.length > descriptionLength[1]){
        throw new Error(`Description should be betwenn ${descriptionLength[0]} and ${descriptionLength[1]} characters long!`)
    }
    if (isNaN(data.price) || Number(data.price) <= 0) {
        throw new Error('Price should be a positive number')
    }
}

exports.getElectronicsLean = () => Electronic.find().lean()

exports.validateAndCreate = (electronicData) => {
    try {
        validate(electronicData)

        return Electronic.create(electronicData)
    } catch (error) {
        throw new Error(error.message)
    }
}