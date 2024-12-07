var express = require('express');
const { register, login, logout } = require('../controllers/userAuth');
const upload = require('../config/multer-config');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const userModel = require('../models/userModel');
const chatModel = require('../models/textModel');
var router = express.Router();
router.use(express.json());

router.get('/', async function (req, res, next) {
    let error = req.flash('error')
    res.render('index', { error });
});


router.get('/dashboard', isLoggedIn ,async function (req, res, next) {
    let user = req.user
    console.log(user.username)
    let allUsers = await userModel.find({_id: {$nin: user._id}})
    res.render('dashboard', {user, allUsers})
});

router.post('/save-chat', async function (req, res, next) {
    let chat = await chatModel.create({
        senderId : req.body.sender_id,
        recieverId: req.body.reciever_id,
        message: req.body.text
    })

    res.json({success: true, chat})
    // res.json(chat)
})


router.post('/register', upload.single('image'), register)

router.post('/login', login)


router.get('/logout', logout)


module.exports = router;
