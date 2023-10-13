const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser')
const {isAuth} = require('../middlewares/authMiddleware.js')

function expressConfigurator(app) {
    app.use(express.static(path.resolve(__dirname, '../static')))
    app.use(cookieParser())
    app.use(express.urlencoded({extended: true}))
    app.use(isAuth)
}

module.exports = expressConfigurator