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
    if (isNaN(Number(data.production)) || Number(data.production) < 1900 || Number(data.production) > 2023) {
        throw new Error('Production should be between the year 1900 and 2023')
    }
    if (isNaN(Number(data.exploitation)) || Number(data.exploitation) <= 0) {
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
    if (isNaN(Number(data.price)) || Number(data.price) <= 0) {
        throw new Error('Price should be a positive number')
    }
}

exports.getElectronicsLean = () => Electronic.find().lean()
exports.findByIdLean = (id) => Electronic.findById(id).lean()

exports.validateAndCreate = (electronicData) => {
    try {
        validate(electronicData)

        return Electronic.create(electronicData)
    } catch (error) {
        throw new Error(error.message)
    }
}

exports.validateAndUpdate = (id, electronicData) => {
    try {
        validate(electronicData)

        return Electronic.findByIdAndUpdate(id, electronicData)
    } catch (error) {
        throw new Error(error.message)
    }
}

exports.deleteElectronicById = (id) => Electronic.findByIdAndDelete(id)

exports.buyElectronic = async (electornicId, userId) => {
    try {
        const electronicData = await Electronic.findById(electornicId)

        if (!electronicData.buyingList.includes(userId)) {
            electronicData.buyingList.push(userId)
        }

        electronicData.save()
    } catch (error) {
        throw new Error(error)
    }
}

exports.findByNameOrType = async (name, type) => {
    let electornics = await Electronic.find().lean()

    if(name) {
        electornics = electornics.filter((x) => x.name.toLowerCase().includes(name.toLowerCase()))
    }
    if(type) {
        electornics = electornics.filter((x) => x.type.toLowerCase().includes(type.toLowerCase()))
    }

    return electornics
}