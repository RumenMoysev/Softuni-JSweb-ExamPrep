const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('../lib/jwtPromise.js')
const SECRET = require('../configs/config.js')

const usernameLength = 2
const emailLength = 10
const passwordLength = 4

function validate(userData, rePassword) {
    if(userData.email) {
        if (userData.username.length < emailLength) {
            throw new Error(`Email should be at least ${emailLength} characters long.`)
        }
    }

    if (userData.username.length < usernameLength) {
        throw new Error(`Username should be at least ${usernameLength} characters long.`)
    }
    if (userData.password.length < passwordLength) {
        throw new Error(`Password should be at least ${passwordLength} characters long.`)
    }

    if(rePassword) {
        if (rePassword !== userData.password) {
            throw new Error('Passwords do not match')
        }
    }
}

exports.validateAndRegister = async (userData, repeatPassword) => {
    try {
        validate(userData, repeatPassword)
        userData.password = await bcrypt.hash(userData.password, 10)
        await User.create(userData)

        const user = await User.findOne({ email: userData.email }).lean()
        return createJWTtoken(user, SECRET)

    } catch (error) {
        throw new Error(error.message)
    }
};

exports.validateAndLogin = async (userData) => {
    try {
        validate(userData)

        const user = await User.findOne({ username: userData.username }).lean()

        if (user) {
            const isValid = await bcrypt.compare(userData.password, user.password)
            
            if (!isValid) {
                throw new Error('Email or password do not match!')
            }

            return createJWTtoken(user, SECRET)
        } else {
            throw new Error('Email or password do not match!')
        }
        
    } catch (error) {
        throw new Error(error.message)
    }
}

function createJWTtoken(data, secret) { return jwt.sign(data, secret) }