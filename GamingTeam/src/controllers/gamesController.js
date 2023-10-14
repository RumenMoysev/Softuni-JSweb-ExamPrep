const router = require('express').Router()

const gameManager = require('../managers/gameManager.js')

router.get('/catalog', async (req, res) => {
    const games = await gameManager.getGamesLean()

    res.render('gamesTemp/catalog', {games})
})

router.get('/create', (req, res) => {
    res.render('gamesTemp/create')
})

router.post('/create',async (req, res) => {
    const gameData = {
        name: req.body.name,
        image: req.body.image,
        price: Number(req.body.price),
        description: req.body.description,
        genre: req.body.genre,
        platform: req.body.platform,
        owner: req.user._id
    }

    try {
        await gameManager.validateAndCreate(gameData)
        res.redirect('/games/catalog')
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router