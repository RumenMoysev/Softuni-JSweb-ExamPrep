const router = require('express').Router()

const petManager = require('../managers/petManager.js')
const routeGuard = require('../middlewares/routeGuard.js')

router.get('/catalog', async (req, res) => {
    const pets = await petManager.getPetsLean()
    res.render('petTemps/catalog', { pets })
})

router.get('/add', routeGuard, (req, res) => {
    res.render('petTemps/create')
})

router.post('/add', routeGuard, async (req, res) => {
    const petData = {
        name: req.body.name,
        image: req.body.image,
        age: req.body.age,
        description: req.body.description,
        location: req.body.location,
        owner: req.user._id
    }

    try {
        await petManager.validateAndCreate(petData)
        res.redirect('/pets/catalog')
    } catch (error) {
        const err = error.message
        res.render('petTemps/create', { petData, err })
    }
})

router.get('/:petId/details', async (req, res) => {
    const petId = req.params.petId

    try {
        const petData = await petManager.getPetDataLeanWithPopulation(petId)
        const isOwner = req.user?._id == petData.owner._id
        const notOwner = req.user?._id != petData.owner._id

        res.render('petTemps/details', { petData, isOwner, notOwner })
    } catch (error) {
        res.redirect('/404')
    }
})

router.post('/:petId/details', async (req, res) => {
    const petId = req.params.petId
    const comment = req.body.comment

    try {
        if (!res.locals.isAuthenticated) {
            throw new Error('You need to be logged in to post a comment')
        }
        if(comment.length < 0) {
            throw new Error('Comment should be at least 1 character long')
        }

        const userId = req.user._id
        
        await petManager.addCommentAndGetData(userId, comment, petId)

        res.redirect(`/pets/${petId}/details`)
    } catch (error) {
        const petData = await petManager.getPetDataLeanWithPopulation(petId)

        const isOwner = req.user?._id == petData.owner._id
        const notOwner = req.user?._id != petData.owner._id

        const err = error.message

        res.render('petTemps/details', { petData, isOwner, notOwner, err })
    }
})

router.get('/:petId/edit', routeGuard, async (req, res) => {
    const petId = req.params.petId

    try {
        const petData = await petManager.getPetDataLean(petId)
        const isOwner = req.user?._id == petData.owner._id
        if (!isOwner) {
            throw Error
        }

        res.render('petTemps/edit', { petData })
    } catch (error) {
        res.redirect('/404')
    }
})

router.post('/:petId/edit', routeGuard, async (req,res) => {
    const petId = req.params.petId

    const petData = {
        name: req.body.name,
        image: req.body.image,
        age: req.body.age,
        description: req.body.description,
        location: req.body.location
    }

    try {
        const petData1 = await petManager.getPetDataLean(petId)
        const isOwner = req.user?._id == petData1.owner._id
        if (!isOwner) {
            res.redirect('/404')
        }

        await petManager.validateAndUpdate(petId, petData)
        res.redirect(`/pets/${petId}/details`)
    } catch (error) {
        const err = error.message
        res.render('petTemps/edit', { petData, err })
    }
})

router.get('/:petId/delete', routeGuard, async (req, res) => {
    const petId = req.params.petId

    try {
        const petData = await petManager.getPetDataLean(petId)

        const isOwner = req.user?._id == petData.owner
        if(!isOwner) {
            throw Error
        }

        await petManager.deletePet(petId)
        res.redirect(`/pets/catalog`)
    } catch (error) {
        res.redirect('/404')
    }
})

module.exports = router