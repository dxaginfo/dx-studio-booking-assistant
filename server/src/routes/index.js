const express = require('express');
const bookingRoutes = require('./bookingRoutes');
// Import other route files as needed

const router = express.Router();

// API documentation route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Studio Booking Assistant API',
    version: '1.0.0',
    endpoints: {
      bookings: '/api/bookings',
      // List other endpoint groups here as they are added
    }
  });
});

// Register routes
router.use('/bookings', bookingRoutes);
// Register other routes as needed

module.exports = router;