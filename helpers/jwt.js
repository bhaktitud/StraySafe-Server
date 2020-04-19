const jwt = require('jsonwebtoken')

function generateToken(id){
    return jwt.sign({id}, process.env.SECRET_KEY)
}

module.exports = { generateToken }