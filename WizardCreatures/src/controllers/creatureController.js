const router = require('express').Router()

const creatureManager = require('../managers/creatureManager.js')

router.get('/posts', async (req, res) => {
    try {
        const creatures = await creatureManager.getAllCreaturesLean()
        res.render('creatureTemps/all-posts', { creatures })
    } catch (error) {
        console.log(error.message)
        res.redirect('/creatures/posts')
    }
});

router.get('/create', (req, res) => {
    res.render('creatureTemps/create')
})

router.post('/create', async (req, res) => {
    const creatureData = {
        name: req.body.name,
        species: req.body.species,
        skinColor: req.body.skinColor,
        eyeColor: req.body.eyeColor,
        image: req.body.image,
        description: req.body.description,
        owner: req.user._id
    }

    try {
        await creatureManager.validateAndCreate(creatureData)
        res.redirect('/creatures/posts')
    } catch (error) {
        const err = error.message
        res.render('creatureTemps/create', {err}) 
    }
})

router.get('/:creatureId/details', async (req, res) => {
    const creatureId = req.params.creatureId
    const userId = req.user?._id

    try {
        const creatureData = await creatureManager.getCreatureByIdLean(creatureId)
        const isOwner = creatureData.owner._id == userId

        //TODO: VOTING
        res.render('creatureTemps/details', {creatureData, isOwner})
    } catch (error) {
        console.log(error.message)
        res.redirect('/creatures/posts')
    }
})

router.get('/:creatureId/delete', async (req, res) => {
    const creatureId = req.params.creatureId

    try {
        await creatureManager.deleteCreatureById(creatureId)
        res.redirect('/creatures/posts')
    } catch (error) {
        console.log(error.message)
        res.redirect('creatures/posts')
    }
})

router.get('/:creatureId/edit', async (req, res) => {
    const creatureId = req.params.creatureId
    try {
        const creatureData = await creatureManager.getCreatureByIdLean(creatureId)
        res.render('creatureTemps/edit', {creatureData})
    } catch (error) {
        const err = error.message
        console.log(err)
        res.redirect(`/creatures/${creatureId}/details`)
    }
})

router.post('/:creatureId/edit', async (req, res) => {
    const creatureId = req.params.creatureId

    const creatureData = {
        name: req.body.name,
        species: req.body.species,
        skinColor: req.body.skinColor,
        eyeColor: req.body.eyeColor,
        image: req.body.image,
        description: req.body.description
    }

    try {
        await creatureManager.validateAndEditCreatureById(creatureId, creatureData)
        res.redirect(`/creatures/${creatureId}/details`)
    } catch (error) {
        const err = error.message
        console.log(err)
        res.redirect(`/creatures/${creatureId}/details`)
    }
})

module.exports = router