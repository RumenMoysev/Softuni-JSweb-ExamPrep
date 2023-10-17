const router = require('express').Router()

const animalManager = require('../managers/animalManager.js')

router.get('/', async (req, res) => {
    const animals = await animalManager.getAnimalsLean()

    res.render('animalTemps/dashboard', {animals})
})

module.exports = router