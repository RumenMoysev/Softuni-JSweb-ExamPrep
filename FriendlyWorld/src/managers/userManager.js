const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('../utils/jwtPromise.js')
const SECRET = require('../config/config.js').SECRET

const emailLength = 10
const passwordLength = 4

function validate(userData, rePassword) {
    if(userData.email.length < emailLength) {
        throw new Error(`Email should be at least ${emailLength} characters long.`)
    }
    if(userData.password.length < passwordLength) {
        throw new Error(`Password should be at least ${passwordLength} characters long.`)
    }
    if(rePassword) {
        if(rePassword !== userData.password) {
            throw new Error('Passwords do not match')
        }
    }
}

function throwError (data) {
    throw new Error(data)
}

exports.validateRegisterAndLogin = async (userData, rePassword) => {
    try {       
        validate(userData, rePassword)
        userData.password = await bcrypt.hash(userData.password, 10)
        await User.create(userData)

        const payload = await User.findOne({ email: userData.email }).lean()

        return jwt.sign(payload, SECRET)
    } catch (error) {
        throwError(error.message)
    }
}

exports.validateAndLogin = async (userData) => {
    try {
        validate(userData)
        const payload = await User.findOne({email: userData.email}).lean()

        return jwt.sign(payload, SECRET)        
    } catch (error) {
        throwError(error.message)
    }
}