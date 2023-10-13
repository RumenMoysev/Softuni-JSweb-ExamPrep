const router = require('express').Router()

router.get('/register', (req, res) => {
    res.render('userTemps/register')
});

router.get('/login', (req, res) => {
    res.render('userTemps/login')
});

module.exports = router