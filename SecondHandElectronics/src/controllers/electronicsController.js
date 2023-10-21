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


router.get('/create', async (req, res) => {
    res.render('electronicTemps/create')
})

router.post('/create', async (req, res) => {
    const electronicData = {
        name: req.body.name,
        type: req.body.type,
        damages: req.body.damages,
        image: req.body.image,
        description: req.body.description,
        production: Number(req.body.production),
        exploitation: Number(req.body.exploitation),
        price: Number(req.body.price),
        owner: req.user._id
    }
    //make numbers being saved strangely

    try {
        await electronicsManager.validateAndCreate(electronicData)
        res.redirect('/electronics/catalog')
    } catch (error) {
        const err = error.message
        res.render('electronicTemps/create', {electronicData, err})
    }
})

router.get('/:electronicId/details', async (req, res) => {
    const electronicId = req.params.electronicId

    try {
        const electronicData = await electronicsManager.findByIdLean(electronicId)
        const isOwner = req.user?._id == electronicData?.owner
        const hasBought = electronicData.buyingList.includes(req.user?._id)

        res.render('electronicTemps/details', {electronicData, isOwner, hasBought})
    } catch (error) {
        res.redirect('/404')
    }
})

module.exports = router