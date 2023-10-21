const jwt = require('../lib/jwtPromise.js')
const SECRET = require('../configs/config.js')

exports.isAuth = async (req, res, next) => {
    const token = req.cookies['auth']

    if (token) {

        try {
            const user = await jwt.verify(token, SECRET)
            req.user = user
            res.locals.isAuthenticated = true
            next()
        } catch (err) {
            res.clearCookie('auth')
            res.locals.isAuthenticated = false

            res.redirect('/')
        }
    } else {
        res.locals.isAuthenticated = false
        next()
    }
}