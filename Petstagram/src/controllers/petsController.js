const router = require('express').Router()

const petManager = require('../managers/petManager.js')

router.get('/catalog', async (req, res) => {
    const pets = await petManager.getPetsLean()
    console.log(pets)
    res.render('petTemps/catalog', {pets})
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
        res.render('petTemps/create', {petData, err})
    }
})

module.exports = router