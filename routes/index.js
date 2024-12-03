var express = require('express');
const { register } = require('../controllers/userAuth');
var router = express.Router();
/* GET home page. */

router.get('/', async function (req, res, next) {
    res.render('index');
});
router.post('/register', register)
router.get('/', async function (req, res, next) {
    res.render('index');
});


module.exports = router;
