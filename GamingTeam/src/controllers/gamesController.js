const router = require('express').Router()

const gameManager = require('../managers/gameManager.js')

const chosenOption = require('../utils/chosenOption.js')

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

router.get('/:gameId/details', async (req, res) => {
    const gameId = req.params.gameId
    const gameData = await gameManager.findGameByIdLean(gameId)
    const userId = req.user?._id

    const isOwner = userId == gameData.owner

    //TODO BUYING LOGIC

    res.render('gamesTemp/details', {isOwner, gameData})
})

router.get('/:gameId/edit', async (req, res) => {
    const gameId = req.params.gameId
    const gameData = await gameManager.findGameByIdLean(gameId)

    if(req.user._id == gameData.owner) {
        const options = chosenOption(gameData.platform)
        console.log(options)

        res.render('gamesTemp/edit', { gameData, options })
    } else {
        res.redirect(`/games/${gameId}/details`)
    }
})

router.post('/:gameId/edit', async (req, res) => {
    const gameData = {
        name: req.body.name,
        image: req.body.image,
        price: Number(req.body.price),
        description: req.body.description,
        genre: req.body.genre,
        platform: req.body.platform,
    }

    const gameId = req.params.gameId

    try {
        await gameManager.findValidateAndUpdate(gameId, gameData)
        res.redirect(`/games/${gameId}/details`)
    } catch (error) {
        const err = error.message
        res.render('gamesTemp/edit', { gameData, err })
    }
})

router.get('/:gameId/delete', async (req, res) => {
    const gameId = req.params.gameId

    //VALIDATE IF OWNER
    try {
        await gameManager.deleteGame(gameId)
        res.redirect('/games/catalog')
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router