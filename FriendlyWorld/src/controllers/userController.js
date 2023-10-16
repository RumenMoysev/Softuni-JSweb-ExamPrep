const router = require('express').Router()

const userManager = require('../managers/userManager.js')

router.get('/register', (req, res) => {
    res.render('userTemps/register')
})

router.post('/register', async (req, res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password
    }

    const rePassword = req.body.rePassword

    try {
        const token = await userManager.validateRegisterAndLogin(userData, rePassword)
        res.cookie('auth', token)
        res.redirect('/')
    } catch (error) {
        const err = error.message
        res.render('userTemps/register', {userData, rePassword, err})
    }
})

router.get('/login', (req, res) => {
    res.render('userTemps/login')
})

router.post('/login', async (req, res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password
    }

    try {
        const token = await userManager.validateAndLogin(userData)
        res.cookie('auth', token)

        res.redirect('/')
    } catch (error) {
        const err = error.message
        res.render('userTemps/login', { userData, err })
    }
})

module.exports = router