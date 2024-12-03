const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const tokenGenerator = require('../utils/jwtGenerator')

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        let user = userModel.find({ username })
        if (user) {
            req.flash('error', 'you already have an account, please login.')
            res.redirect('/index')
        }
        else {
            const hashPass = await bcrypt.hash(password, 10)
            let user = await userModel.create({
                username,
                email,
                password: hashPass
            })
            const token = tokenGenerator(user)
            res.cookie('token', token)
            res.redirect('/dashboard')
        }
    } catch (error) {
        req.flash('error', error)
        res.redirect('/index')
    }
}