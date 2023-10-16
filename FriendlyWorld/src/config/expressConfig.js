const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const isAuthenticated = require('../middlewares/isAuthenticated.js')

function expressConfigurator(app) {
    app.use(cookieParser())
    app.use(express.static(path.resolve(__dirname, '../static')))
    app.use(express.urlencoded({extended:true}))
    app.use(isAuthenticated)
}

module.exports = expressConfigurator