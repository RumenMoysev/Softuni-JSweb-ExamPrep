const router = require('express').Router()

router.get('/catalog', async (req, res) => {
    res.render('electronicTemps/catalog')
})

module.exports = router