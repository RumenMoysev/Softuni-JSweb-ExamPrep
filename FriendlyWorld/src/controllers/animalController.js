const router = require('express').Router()

const animalManager = require('../managers/animalManager.js')

router.get('/', async (req, res) => {
    const animals = await animalManager.getAnimalsLean()

    res.render('animalTemps/dashboard', {animals})
})

router.get('/add', (req, res) => {
    res.render('animalTemps/create')
})

router.post('/add', async (req, res) => {
    const animalData = {
        name: req.body.name,
        years: Number(req.body.years),
        kind: req.body.kind,
        image: req.body.image,
        need: req.body.need,
        location: req.body.location,
        description: req.body.description,
        owner: req.user._id
    }

    try {
        await animalManager.validateAndCreate(animalData)

        res.redirect('/animals')
    } catch (error) {
        const err = error.message
        res.render('animalTemps/create', {err})
    }
})

router.get('/:animaId/details', async (req, res) => {
    const animalId = req.params.animaId

    try {
        const animalDetails = await animalManager.getAnimalByIdLean(animalId)
        const isOwner = req.user?._id == animalDetails.owner

        res.render('animalTemps/details', {animalDetails, isOwner})
    } catch (error) {
        res.redirect('/404')
    }
})

router.get('/:animalId/edit', async (req, res) => {
    const animalId = req.params.animalId

    try {
        const animalDetails = await animalManager.getAnimalByIdLean(animalId)

        res.render('animalTemps/edit', { animalDetails })
    } catch (error) {
        res.redirect('/404')
    }
})

router.post('/:animalId/edit', async (req, res) => {
    const animalId = req.params.animalId

    const animalDetails = {
        name: req.body.name,
        years: Number(req.body.years),
        kind: req.body.kind,
        image: req.body.image,
        need: req.body.need,
        location: req.body.location,
        description: req.body.description,
        owner: req.user._id
    }

    try {
        await animalManager.validateAndUpdate(animalDetails, animalId)

        res.redirect(`/animals/${animalId}/details`)
    } catch (error) {
        const err = error.message
        res.render('animalTemps/edit', { animalDetails, err })
    }
})

router.get('/:animalId/detele', (req, res) => {
    try {
        
    } catch (error) {
        
    }
})

module.exports = router