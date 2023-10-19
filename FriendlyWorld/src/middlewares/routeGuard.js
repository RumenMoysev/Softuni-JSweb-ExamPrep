function routeGuard(req, res, next) {
    req.user ? next() : res.redirect('/404')
}

module.exports = routeGuard