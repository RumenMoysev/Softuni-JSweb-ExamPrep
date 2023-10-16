const jwt = require('jsonwebtoken')

exports.sign = (payload, secret, options) => {
    const promise = new Promise((resolve, reject) => {
        jwt.sign(payload, secret, options, (err, result) => {
            if(err) {
                return reject(result)
            }
            return resolve(result)
        })
    })

    return promise
}

exports.verify = (token, secret, options) => {
    const promise = new Promise((resolve, reject) => {
        jwt.verify(token, secret, options, (err, result) => {
            if(err) {
                return reject(result)
            }
            
            return resolve(result)
        })
    })

    return promise
}