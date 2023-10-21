const router = require('express').Router()

const electronicsManager = require('../managers/electronicsManager.js')

router.get('/catalog', async (req, res) => {
    try {
        const electronics = await electronicsManager.getElectronicsLean()
        res.render('electronicTemps/catalog', {electronics})
    } catch (error) {
        console.log(error.message)
        res.render('electronicTemps/catalog')
    }
})

module.exports = router