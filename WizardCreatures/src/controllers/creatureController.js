const router = require('express').Router()

router.use('/posts', (req, res) => {
    res.render('creatureTemps/all-posts')
});

module.exports = router