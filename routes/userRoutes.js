const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe
} = require('./../routes/controllers/userController');
const {
  signUp,
  login,
  forgotPassword,
  resetPaswword,
  updatePassword,
  protect
} = require('./controllers/authController');
const router = express.Router();
console.log('i am userRouter before get ')
router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token',resetPaswword);
router.patch('/updateuser',protect,updatePassword)
router.patch('/updateme',protect,updateMe)
router.delete('/deleteme',protect,deleteMe)
router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
