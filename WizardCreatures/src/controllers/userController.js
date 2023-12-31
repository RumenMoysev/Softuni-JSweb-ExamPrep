const router = require('express').Router()

const userManager = require('../managers/userManager.js');
const creatureManager = require('../managers/creatureManager.js')
const routeGuard = require('../middlewares/routeGuard.js');

router.get('/register', (req, res) => {
    res.render('userTemps/register')
});

router.post('/register',async (req, res) => {
    const userData =  {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    }
    
    const password = JSON.parse(JSON.stringify(userData.password))

    const repeatPassword = req.body.rePassword

    try {
        const token = await userManager.validateAndRegister(userData, repeatPassword)
        res.cookie('auth', token)
        res.redirect('/')
    } catch(error) {
        const err = error.message
        userData.password = password
        res.render('userTemps/register', { err })
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

    const password = JSON.parse(JSON.stringify(userData.password))

    try {
        const token = await userManager.validateAndLogin(userData)
        res.cookie('auth', token)
        res.redirect('/')
    } catch (error) {
        const err = error.message
        userData.password = password
        res.render('userTemps/login', {err})
    }
});

router.get('/logout', routeGuard, (req, res) => {
    res.clearCookie('auth')
    res.redirect('/')
})

router.get('/profile', routeGuard, async (req, res) => {
    const userId = req.user._id

    try {
        const userPosts = await creatureManager.getUserPosts(userId)
        if(userPosts) {
            for (let el of userPosts) {
                el.voteCount = el.votes.length
            }
        }
        
        const userData = userManager.getUserData(userId)
        res.render('userTemps/my-posts', {userPosts, userData})
    } catch (error) {
        res.redirect('/')
    }
})

module.exports = router