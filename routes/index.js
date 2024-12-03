var express = require('express');
const { register, login, logout } = require('../controllers/userAuth');
const upload = require('../config/multer-config');
var router = express.Router();
/* GET home page. */

router.get('/', async function (req, res, next) {
    let error = req.flash('error')
    res.render('index', { error });
});

router.get('/dashboard', async function (req, res, next) {
    res.render('dashboard')
});

router.post('/register', upload.single('image'), register)

router.post('/login', login)

router.get('/logout', logout)



module.exports = router;
