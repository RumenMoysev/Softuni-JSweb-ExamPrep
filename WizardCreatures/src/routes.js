const router = require('express').Router()

const homeController = require('./controllers/homeController.js')
const usersController = require('./controllers/userController.js')
const creatureController = require('./controllers/creatureController.js')

router.use(homeController)
router.use('/users', usersController)
router.use('/creatures', creatureController)
router.use('*', (req, res) => {
    res.redirect('/404')
})

module.exports = router