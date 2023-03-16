const express = require('express');
const log = console.log;
const {
  getAllTour,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getStats
} = require('./../routes/controllers/tourControler');
const router = express.Router();
const { protect, restrictTo,forgotPassword } = require('./controllers/authController');
// chaining the middleware just pass the function
log('i am tourRouter before get ')
router.route('/forgotPassword').post(forgotPassword)
router.route('/tour-get-state').get(getStats)
router.route('/').get(protect, getAllTour).post(createTour);
log('i am tourRouter  after get')
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
///chaining middle is responsible of error
