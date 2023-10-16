const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')

function expressConfigurator(app) {
    app.use(cookieParser())
    app.use(express.static(path.resolve(__dirname, '../static')))
    app.use(express.urlencoded({extended:true}))
}

module.exports = expressConfigurator