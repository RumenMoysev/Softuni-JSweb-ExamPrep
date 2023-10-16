const express = require('express')

const app = express()
const SERVER_PORT = 3000

const expressConfigurator = require('./config/expressConfig.js')
const handlebarsConfigurator = require('./config/handlebarsConfig.js')
const dbConnect = require('./config/dbConfig.js')
const router = require('./router.js')

dbConnect()
    .then(() => console.log('Db connected successfuly'))
    .catch((err) => console.log('Db error', {err}))

expressConfigurator(app)
handlebarsConfigurator(app)

app.use(router)

app.listen(SERVER_PORT, console.log(`Server is listening on port ${SERVER_PORT}`))