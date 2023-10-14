const router = require('express').Router()

router.get('/catalog', (req, res) => {
    res.render('gamesTemp/catalog')
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
        await gameManager.validateAndCreate()
    } catch (error) {
        
    }
})

module.exports = router