const mongoose = require('mongoose');

const textModel = mongoose.Schema({
    senderId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    recieverId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    message: String,
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('text', textModel);