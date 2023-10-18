const router = require('express').Router()

router.get('/catalog', (req, res) => {
    res.render('petTemps/catalog')
})

module.exports = router