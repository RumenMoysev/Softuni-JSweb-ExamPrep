const router = require('express').Router()

const animalManager = require('../managers/animalManager.js')

router.get('/', async (req, res) => {
    let animalArr = []
    const animals = await animalManager.getAnimalsLean()

    if(animals.length > 3) {
        for (let i = 0; i < 3; i++) {
            animalArr.push(animals[i])
        }
    }
    animalArr = animals

    res.render('home', {animalArr})
})

router.get('/404', (req, res) => {
    res.render('404')
})

module.exports = router