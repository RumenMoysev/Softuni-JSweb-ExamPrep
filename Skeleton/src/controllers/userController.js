const router = require('express').Router()

const userManager = require('../managers/userManager.js')

router.get('/register', (req, res) => {
    res.render('userTemps/register')
});

router.post('/register',async (req, res) => {
    const userData =  {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    
    const repeatPassword = req.body.rePassword

    try {
        const token = await userManager.validateAndRegister(userData, repeatPassword)
        res.cookie('auth', token)
        res.redirect('/')
    } catch(err) {
        console.log(err.message)
    }

})

router.get('/login', (req, res) => {
    res.render('userTemps/login')
});

router.post('/login', async (req, res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password
    }

    try {
        const token = await userManager.validateAndLogin(userData)
        res.cookie('auth', token)
        res.redirect('/')
    } catch (err) {
        console.log(err)
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('auth')
    res.redirect('/')
})

module.exports = router