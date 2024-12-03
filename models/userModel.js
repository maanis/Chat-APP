const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pfp: String,
    is_active:{
        type:Number,
        default: 0
    }
})

module.exports = mongoose.model('user', userModel);