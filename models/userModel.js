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
    is_active: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('user', userModel);