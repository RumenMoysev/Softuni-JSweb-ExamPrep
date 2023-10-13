const User = require('../models/User.js')
const bcrypt = require('bcrypt')

exports.validateAndRegister = async (userData, repeatPassword) => {
    const usernameLength = 5
    const emailLength = 10
    const passwordLength = 4


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
    return User.create(userData)
}