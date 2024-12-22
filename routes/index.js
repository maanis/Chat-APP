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

router.get('/chat/:id', isLoggedIn ,async function (req, res, next) {
    let reciever_id = req.params.id
    let recieverUser = await userModel.findOne({_id: reciever_id})
    let user = req.user
    res.render('chatPage', {user,reciever_id, recieverUser})
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

router.post('/delete-chat', async (req,res)=>{
    let id = req.body.delete_id
    await chatModel.deleteOne({_id: id})
    res.send({success: true})
})

router.post('/edit-chat', async (req,res)=>{
    let id = req.body.edit_id
    let msg = await chatModel.findOne({_id: id})
    console.log(msg)
    res.send({success: true, msg})
})

router.post('/update-chat', async (req,res)=>{
    let text = req.body.text
    let id = req.body.id
    let chat = await chatModel.findOne({_id: id})
    chat.message = text
    await chat.save()
    res.send(chat)
})




router.get('/logout', logout)


module.exports = router;
