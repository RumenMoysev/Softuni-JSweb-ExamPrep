const router = require('express').Router()

const creatureManager = require('../managers/creatureManager.js')

router.get('/posts', async (req, res) => {
    try {
        const creatures = await creatureManager.getAllCreaturesLean()
        res.render('creatureTemps/all-posts', { creatures })
    } catch (error) {
        console.log(error.message)
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
        description: req.body.description
    }

    try {
        await creatureManager.validateAndCreate(creatureData)
        res.redirect('/creatures/posts')
    } catch (error) {
        const err = error.message
        res.render('creatureTemps/create', {err}) 
    }
})

module.exports = router