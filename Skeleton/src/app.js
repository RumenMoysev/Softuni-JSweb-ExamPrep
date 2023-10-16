const express = require('express')

const app = express()
const SERVER_PORT = 3000

const router = require('./routes.js')
const expressConfigurator = require('./configs/expressConfig.js')
const handlebarsConfigurator = require('./configs/handlebarsConfig.js')
const dbConnect = require('./configs/dbConfig.js')

dbConnect()
    .then(() => console.log('DB connected successfully'))
    .catch((err) => console.log(`Db crashed with ${err}`))

expressConfigurator(app)
handlebarsConfigurator(app)


app.use(router)

app.listen(SERVER_PORT, console.log(`App is listening on port ${SERVER_PORT}`))