var express = require('express');
const { register, login } = require('../controllers/userAuth');
var router = express.Router();
/* GET home page. */

router.get('/', async function (req, res, next) {
    let error = req.flash('error')
    res.render('index', {error});
});

router.get('/dashboard', async function (req, res, next) {
    res.render('dashboard')
});

router.post('/register', register)
router.post('/login', login)



module.exports = router;
