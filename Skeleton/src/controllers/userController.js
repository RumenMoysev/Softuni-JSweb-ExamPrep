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
        await userManager.validateAndRegister(userData, repeatPassword)
        res.redirect('/')
    } catch(err) {
        console.log(err.message)
    }

})

router.get('/login', (req, res) => {
    res.render('userTemps/login')
});

module.exports = router