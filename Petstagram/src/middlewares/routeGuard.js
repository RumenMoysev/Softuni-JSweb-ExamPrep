function routeGuard(req, res, next) {
    req.user ? next() : res.render('userTemps/login')
}

module.exports = routeGuard