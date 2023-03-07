const express = require('express');
const {
  getAllTour,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require('./../routes/controllers/tourControler');
const router = express.Router();
const { protect, restrictTo } = require('./controllers/authController');
// chaining the middleware just pass the function
router.route('/').get(getAllTour).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
///chaining middle is responsible of error
