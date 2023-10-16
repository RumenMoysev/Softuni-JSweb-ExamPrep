const jwt = require('../utils/jwtPromise.js')
const SECRET = require('../config/config.js').SECRET

async function isAuthenticated (req, res, next) {
    const token = req.cookies.auth

    if(token) {
        try {
            const user = await jwt.verify(token, SECRET)
            req.user = user
            res.locals.isAuthenticated = true
            next()
        } catch (error) {
            res.clearCookie('auth')

            res.redirect('/')
        }
    } else {
        next()
    }
}

module.exports = isAuthenticated