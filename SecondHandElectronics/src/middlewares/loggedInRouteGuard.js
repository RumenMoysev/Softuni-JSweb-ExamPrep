function loggedInRouteGuard(req, res, next) {
    req.user ? res.redirect('/404') : next()
}

module.exports = loggedInRouteGuard