const router = require('express').Router()

const petManager = require('../managers/petManager.js')

router.get('/catalog', async (req, res) => {
    const pets = await petManager.getPetsLean()
    res.render('petTemps/catalog', { pets })
})

router.get('/add', (req, res) => {
    res.render('petTemps/create')
})

router.post('/add', async (req, res) => {
    const petData = {
        name: req.body.name,
        image: req.body.image,
        age: req.body.age,
        description: req.body.description,
        location: req.body.location,
        owner: req.user._id
    }

    try {
        await petManager.validateAndCreate(petData)
        res.redirect('/pets/catalog')
    } catch (error) {
        const err = error.message
        res.render('petTemps/create', { petData, err })
    }
})

router.get('/:petId/details', async (req, res) => {
    const petId = req.params.petId

    try {
        const petData = await petManager.getPetDataLeanWithPopulation(petId)
        const isOwner = req.user?._id == petData.owner._id
        const notOwner = req.user?._id != petData.owner._id

        res.render('petTemps/details', { petData, isOwner, notOwner })
    } catch (error) {
        res.redirect('/404')
    }
})

router.get('/:petId/edit', async (req, res) => {
    const petId = req.params.petId

    try {
        const petData = await petManager.getPetDataLean(petId)
        const isOwner = req.user?._id == petData.owner._id
        if (!isOwner) {
            throw Error
        }

        res.render('petTemps/edit', { petData })
    } catch (error) {
        res.redirect('/404')
    }
})

router.post('/:petId/edit', async (req,res) => {
    const petId = req.params.petId

    const petData = {
        name: req.body.name,
        image: req.body.image,
        age: req.body.age,
        description: req.body.description,
        location: req.body.location
    }

    try {
        await petManager.validateAndUpdate(petId, petData)
        res.redirect(`/pets/${petId}/details`)
    } catch (error) {
        const err = error.message
        res.render('petTemps/edit', { petData, err })
    }
})

router.get('/:petId/delete', async (req, res) => {
    const petId = req.params.petId

    try {
        const petData = await petManager.getPetDataLean(petId)

        const isOwner = req.user?._id == petData.owner
        if(!isOwner) {
            throw Error
        }
        
        await petManager.deletePet(petId)
        res.redirect(`/pets/catalog`)
    } catch (error) {
        res.redirect('/404')
    }
})

module.exports = router