const Animal = require('../models/Animal.js')

exports.getAnimalsLean = () => Animal.find()