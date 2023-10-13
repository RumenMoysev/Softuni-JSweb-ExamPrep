const express = require('express')

const app = express()
const SERVER_PORT = 3000

const expressConfigurator = require('./configs/expressConfig.js')

expressConfigurator(app)


app.get('/', (req, res) => {
    res.send('Hello')
})

app.listen((SERVER_PORT) => {console.log("App is listening")})