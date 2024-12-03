var express = require('express');
var router = express.Router();
// var userModel = require('./users')
import userModel from 'users'
/* GET home page. */
router.get('/', async function (req, res, next) {
  let users = await userModel.create({
    username: 'manish973',
    name: 'Manish Jha',
    age: 21
  })
  res.send(users)
});

router.get('/read', async function (req, res, next) {
  let allUser = await userModel.find()
  let specificUser = await userModel.findOne({ _id: '6721d5a9d15c34c87c18bbd4' })
  res.send(allUser)
  res.send(specificUser)
});

router.get('/delete', async function (req, res, next) {
  let deletedUser = await userModel.findOneAndDelete({ age: 21 })
  res.send(deletedUser)
});

router.get('/update', async function (req, res, next) {
  // let updatedUser = await userModel.findOneAndUpdate({ find }, { update }, { new: true })
  let updatedUser = await userModel.findOneAndUpdate({ age: 21 }, { name: 'Vicky And Manish' }, { new: true })
  res.send(updatedUser)
});



module.exports = router;
