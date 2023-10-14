function routeGuard(req, res, next) {
    req.user ? next() : res.redirect('/users/login')
}

module.exports = routeGuard