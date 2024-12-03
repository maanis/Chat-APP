const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const tokenGenerator = require('../utils/jwtGenerator')

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        let user = await userModel.findOne({ username })
        if (user) {
            req.flash('error', 'you already have an account, please login.')
            res.redirect('/')
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
        res.redirect('/')
    }
}

module.exports.login = async(req,res,next)=>{
    try {
        const {username, password} = req.body
        let user = await userModel.findOne({username})
        if(user){
           bcrypt.compare(password, user.password, (err, result)=>{
                if(result){
                    const token = tokenGenerator(user)
                    res.cookie('token', token)
                    res.redirect('/dashboard')
                }else{
                    req.flash('error', 'username or password incorrect')
                    res.redirect('/')
                }
           }) 
        }
        else{
            req.flash('error', 'you dont have an account, create it first')
            res.redirect('/')
        }
    } catch (error) {
        req.flash('error', error)
        res.redirect('/')
    }
}