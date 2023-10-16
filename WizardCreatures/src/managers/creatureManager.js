const Creature = require('../models/Creature.js')

const nameLength = 2
const speciesLength = 3
const skinColorLength = 3
const eyeColorLength = 3
const descriptionMinLength = 5
const descriptionMaxLength = 500

function validate(data) {
    const { name, species, skinColor, eyeColor, image, description } = data

    function error(err) {
        throw new Error(err)
    }

    if (name.length < nameLength) {
        error(`Name should be at least ${nameLength} characters.`)
    } else if (species.length < speciesLength) {
        error(`Species should be at least ${speciesLength} characters.`)
    } else if (skinColor.length < skinColorLength) {
        error(`Skin color should be at least ${skinColorLength} characters.`)
    } else if (eyeColor.length < eyeColorLength) {
        error(`Eye color should be at least ${eyeColorLength} characters.`)
    } else if (!image.startsWith('http://') && !image.startsWith('https://')) {
        error('Please provide a valid image url')
    } else if (description.length < descriptionMinLength || description.length > descriptionMaxLength) {
        error(`Description should be between ${descriptionMinLength} and ${descriptionMaxLength} characters`)
    }
}

exports.getAllCreaturesLean = () => Creature.find().lean()

exports.validateAndCreate = (data) => {
    try {
        validate(data)

        return Creature.create(data)
    } catch (error) {
        const errorMessage = error.message
        throw new Error(errorMessage)
    }
}

exports.getCreatureByIdLean = (id) => Creature.findById(id).populate('owner').populate('votes').lean()

exports.deleteCreatureById = (id) => Creature.findByIdAndDelete(id)

exports.validateAndEditCreatureById = (id, data) => {
    try {
        validate(data)

        return Creature.findByIdAndUpdate(id, data)
    } catch (error) {
        const errorMessage = error.message
        throw new Error(errorMessage)
    }
}

exports.voteCreature = async (userId, creatureId) => {
    const creatureData = await Creature.findById(creatureId)

    if(!creatureData.votes.includes(userId)) {
        creatureData.votes.push(userId)
    } else {
        throw new Error('You have already voted')
    }

    return creatureData.save()
}

exports.hasUserVoted = async (creatureId, userId) => {
    const creatureData = await Creature.findById(creatureId)

    return creatureData.votes.includes(userId)
}

exports.votes = async (creatureId) => Creature.findById(creatureId).populate('votes').lean()
exports.getUserPosts = (userId) => Creature.find({owner: userId}).lean()
