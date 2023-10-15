const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('../lib/jwtPromise.js')
const SECRET = require('../configs/config.js')

const usernameLength = 5
const emailLength = 10
const passwordLength = 4

exports.validateAndRegister = async (userData, repeatPassword) => {
    if (userData.username.length < usernameLength) {
        throw new Error(`Username should be at least ${usernameLength} characters long`)
    }
    if (userData.email.length < emailLength) {
        throw new Error(`Email should be at least ${emailLength} characters long`)
    }
    if (userData.password.length < passwordLength) {
        throw new Error(`Password should be at least ${passwordLength} characters long`)
    }
    if (userData.password !== repeatPassword) {
        throw new Error('Passwords do not match')
    }

    userData.password = await bcrypt.hash(userData.password, 10)
    await User.create(userData)
    const user = await User.findOne({ email: userData.email }).lean()
    return await createJWTtoken(user, SECRET)
};

exports.validateAndLogin = async (userData) => {
    if (userData.email.length < emailLength) {
        throw new Error(`Email should be at least ${emailLength} characters long`)
    }
    if (userData.password.length < passwordLength) {
        throw new Error(`Password should be at least ${passwordLength} characters long`)
    }

    const user = await User.findOne({email: userData.email}).lean()

    if(user) {
        const isValid = await bcrypt.compare(userData.password, user.password)

        if(!isValid) {
            throw new Error('Email or password do not match!')
        }

        const token = await createJWTtoken(user, SECRET)
        return token
    } else {
        throw new Error('Email or password do not match!')
    }
}

function createJWTtoken(data, secret) {return jwt.sign(data, secret)}