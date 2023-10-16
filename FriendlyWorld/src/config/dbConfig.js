const mongoose = require('mongoose')

const connectionUri = 'mongodb://127.0.0.1:27017/friendlyWorld'

async function dbConnect() {
    mongoose.connect(connectionUri)
}

module.exports = dbConnect