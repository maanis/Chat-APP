const jwt = require('jsonwebtoken')

const tokenGenerator = (data)=>{
    return jwt.sign({email:data.email}, process.env.JWT_SECRET)
}

module.exports = tokenGenerator