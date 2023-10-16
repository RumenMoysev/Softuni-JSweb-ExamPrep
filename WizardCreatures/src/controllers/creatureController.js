const router = require('express').Router()

const creatureManager = require('../managers/creatureManager.js')
const routeGuard = require('../middlewares/routeGuard.js')

router.get('/posts', async (req, res) => {
    try {
        const creatures = await creatureManager.getAllCreaturesLean()
        res.render('creatureTemps/all-posts', { creatures })
    } catch (error) {
        console.log(error.message)
        res.redirect('/creatures/posts')
    }
});

router.get('/create', routeGuard, (req, res) => {
    res.render('creatureTemps/create')
})

router.post('/create', routeGuard, async (req, res) => {
    const creatureData = {
        name: req.body.name,
        species: req.body.species,
        skinColor: req.body.skinColor,
        eyeColor: req.body.eyeColor,
        image: req.body.image,
        description: req.body.description,
        owner: req.user._id
    }

    try {
        await creatureManager.validateAndCreate(creatureData)
        res.redirect('/creatures/posts')
    } catch (error) {
        const err = error.message
        res.render('creatureTemps/create', {err}) 
    }
})

router.get('/:creatureId/details', async (req, res) => {
    const creatureId = req.params.creatureId
    const userId = req.user?._id
    let hasVotes = false
    let hasUserVoted = false
    let votes = 0
    let votedEmails = []

    try {
        const creatureData = await creatureManager.getCreatureByIdLean(creatureId)
        const isOwner = creatureData.owner._id == userId        
        if(creatureData.votes.length > 0) {
            hasVotes = true
            votes = creatureData.votes.length
            creatureData.votes.forEach(x => votedEmails.push(x.email))
            votedEmails = votedEmails.join(', ')

            for(let el of creatureData.votes) {
                if(el._id == userId) {
                    hasUserVoted = true
                }
            }
        }
        
        res.render('creatureTemps/details', { creatureData, isOwner, hasUserVoted, votedEmails, votes })
    } catch (error) {
        console.log(error.message)
        res.redirect('/creatures/posts')
    }
})

router.get('/:creatureId/delete', routeGuard, async (req, res) => {
    const creatureId = req.params.creatureId

    try {
        await creatureManager.deleteCreatureById(creatureId)
        res.redirect('/creatures/posts')
    } catch (error) {
        console.log(error.message)
        res.redirect('creatures/posts')
    }
})

router.get('/:creatureId/edit', routeGuard, async (req, res) => {
    const creatureId = req.params.creatureId
    try {
        const creatureData = await creatureManager.getCreatureByIdLean(creatureId)
        res.render('creatureTemps/edit', {creatureData})
    } catch (error) {
        const err = error.message
        console.log(err)
        res.redirect(`/creatures/${creatureId}/details`)
    }
})

router.post('/:creatureId/edit', routeGuard, async (req, res) => {
    const creatureId = req.params.creatureId

    const creatureData = {
        name: req.body.name,
        species: req.body.species,
        skinColor: req.body.skinColor,
        eyeColor: req.body.eyeColor,
        image: req.body.image,
        description: req.body.description
    }

    try {
        await creatureManager.validateAndEditCreatureById(creatureId, creatureData)
        res.redirect(`/creatures/${creatureId}/details`)
    } catch (error) {
        const err = error.message
        res.render('creatureTemps/edit', {creatureData, err})
    }
})

router.get('/:creatureId/vote', routeGuard, async (req, res) => {
    const creatureId = req.params.creatureId
    const userId = req.user?._id

    try {
        if(userId) {
            await creatureManager.voteCreature(userId, creatureId)
            return res.redirect(`/creatures/${creatureId}/details`)
        } else {
            throw new Error('You need to be logged in to vote')
        }
    } catch (error) {
        const err = error.message
        console.log(err)
        res.redirect(`/creatures/${creatureId}/details`)
    }
})

module.exports = router