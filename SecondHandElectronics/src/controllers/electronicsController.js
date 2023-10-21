const router = require('express').Router()

const electronicsManager = require('../managers/electronicsManager.js')
const routeGuard = require('../middlewares/routeGuard.js')

router.get('/catalog', async (req, res) => {
    try {
        const electronics = await electronicsManager.getElectronicsLean()   
        res.render('electronicTemps/catalog', {electronics})
    } catch (error) {
        console.log(error.message)
        res.render('electronicTemps/catalog')
    }
})


router.get('/create', routeGuard, async (req, res) => {
    res.render('electronicTemps/create')
})

router.post('/create', routeGuard, async (req, res) => {
    const electronicData = {
        name: req.body.name,
        type: req.body.type,
        damages: req.body.damages,
        image: req.body.image,
        description: req.body.description,
        production: req.body.production,
        exploitation: req.body.exploitation,
        price: req.body.price,
        owner: req.user._id
    }

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
        let hasBought = false
        for(let el of electronicData.buyingList) {
            if(el == req.user?._id) {
                hasBought = true
            }
        }

        res.render('electronicTemps/details', {electronicData, isOwner, hasBought})
    } catch (error) {
        res.redirect('/404')
    }
})

router.get('/:electronicId/buy', async (req, res) => {
    const electronicId = req.params.electronicId

    try {
        if(!req.user._id) {
            throw Error
        }
        await electronicsManager.buyElectronic(electronicId, req.user._id)
        res.redirect(`/electronics/${electronicId}/details`)
    } catch (error) {
        res.redirect('/404')
    }
})

router.get('/:electronicId/edit', routeGuard, async (req, res) => {
    const electronicId = req.params.electronicId

    try {
        const electronicData = await electronicsManager.findByIdLean(electronicId)

        if (req.user._id != electronicData.owner) {
            throw Error
        }

        res.render('electronicTemps/edit', { electronicData })
    } catch (error) {
        res.redirect('/404')
    }   
})

router.post('/:electronicId/edit', routeGuard, async (req, res) => {
    const electronicId = req.params.electronicId

    const electronicData = {
        name: req.body.name,
        type: req.body.type,
        damages: req.body.damages,
        image: req.body.image,
        description: req.body.description,
        production: req.body.production,
        exploitation: req.body.exploitation,
        price: req.body.price,
    }

    try {
        const electronicData1 = await electronicsManager.findByIdLean(electronicId)

        if(req.user._id != electronicData1.owner) {
            res.redirect('/404')
        }

        await electronicsManager.validateAndUpdate(electronicId, electronicData)
        res.redirect(`/electronics/${electronicId}/details`)
    } catch (error) {
        const err = error.message
        res.render('electronicTemps/edit', {electronicData, err})
    }
})

router.get('/:electronicId/delete', routeGuard, async (req, res) => {
    const electronicId = req.params.electronicId

    try {
        const electronicData = await electronicsManager.findByIdLean(electronicId)
        
        await electronicsManager.deleteElectronicById(electronicId)
        res.redirect('/electronics/catalog')
    } catch (error) {
        res.redirect('/404')
    }
})

router.get('/search', routeGuard, async (req, res) => {
    const name = req.query.name
    const type = req.query.type

    if(name || type) {
        const electornics = await electronicsManager.findByNameOrType(name, type)
        res.render('electronicTemps/search', { name, type, electornics })
    } else {
        const electornics = await electronicsManager.getElectronicsLean()
        res.render('electronicTemps/search', { electornics })
    }
})

module.exports = router