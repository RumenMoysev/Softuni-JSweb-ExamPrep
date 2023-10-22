const router = require('express').Router()

const userManager = require('../managers/userManager.js');
const routeGuard = require('../middlewares/routeGuard.js');
const loggedInRouteGuard = require('../middlewares/loggedInRouteGuard.js')

router.get('/register', loggedInRouteGuard, (req, res) => {
    res.render('userTemps/register')
});

router.post('/register', loggedInRouteGuard, async (req, res) => {
    const userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    const password = JSON.parse(JSON.stringify(userData.password))

    const repeatPassword = req.body.rePassword
    
    try {
        const token = await userManager.validateAndRegister(userData, repeatPassword)
        res.cookie('auth', token)
        res.redirect('/')
    } catch (error) {
        const err = error.message
        userData.password = password
        res.render('userTemps/register', { err, userData, repeatPassword })
    }

})

router.get('/login', loggedInRouteGuard, (req, res) => {
    res.render('userTemps/login')
});

router.post('/login', async (req, res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password
    }

    const password = JSON.parse(JSON.stringify(userData.password))

    try {
        const token = await userManager.validateAndLogin(userData)
        res.cookie('auth', token)
        res.redirect('/')
    } catch (error) {
        const err = error.message
        userData.password = password
        res.render('userTemps/login', { err, userData })
    }
});

router.get('/logout', routeGuard, (req, res) => {
    res.clearCookie('auth')
    res.redirect('/')
})

module.exports = router