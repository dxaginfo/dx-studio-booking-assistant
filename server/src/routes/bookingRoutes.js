const express = require('express');
const { body, query, param } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const validateRequest = require('../middleware/validateRequest');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Get all bookings with pagination and filtering
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status'),
    query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
    query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
    validateRequest
  ],
  authorize(['admin', 'staff']),
  bookingController.getBookings
);

// Get booking by ID
router.get(
  '/:id',
  [
    param('id').isUUID(4).withMessage('Invalid booking ID'),
    validateRequest
  ],
  authorize(['admin', 'staff', 'client']),
  bookingController.getBookingById
);

// Create new booking
router.post(
  '/',
  [
    body('studioId').isUUID(4).withMessage('Studio ID is required'),
    body('clientId').isUUID(4).withMessage('Client ID is required'),
    body('engineerId').optional().isUUID(4).withMessage('Invalid engineer ID'),
    body('startTime').isISO8601().withMessage('Start time must be a valid date'),
    body('endTime').isISO8601().withMessage('End time must be a valid date'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    body('equipmentIds').optional().isArray().withMessage('Equipment IDs must be an array'),
    body('equipmentIds.*').optional().isUUID(4).withMessage('Invalid equipment ID'),
    validateRequest
  ],
  authorize(['admin', 'staff', 'client']),
  bookingController.createBooking
);

// Update booking
router.put(
  '/:id',
  [
    param('id').isUUID(4).withMessage('Invalid booking ID'),
    body('studioId').optional().isUUID(4).withMessage('Invalid studio ID'),
    body('engineerId').optional().isUUID(4).withMessage('Invalid engineer ID'),
    body('startTime').optional().isISO8601().withMessage('Start time must be a valid date'),
    body('endTime').optional().isISO8601().withMessage('End time must be a valid date'),
    body('status').optional().isIn(['pending', 'confirmed', 'completed']).withMessage('Invalid status'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    body('equipmentIds').optional().isArray().withMessage('Equipment IDs must be an array'),
    body('equipmentIds.*').optional().isUUID(4).withMessage('Invalid equipment ID'),
    validateRequest
  ],
  authorize(['admin', 'staff']),
  bookingController.updateBooking
);

// Cancel booking
router.patch(
  '/:id/cancel',
  [
    param('id').isUUID(4).withMessage('Invalid booking ID'),
    body('cancelledReason').optional().isString().withMessage('Cancellation reason must be a string'),
    validateRequest
  ],
  authorize(['admin', 'staff', 'client']),
  bookingController.cancelBooking
);

// Get bookings for calendar view
router.get(
  '/calendar',
  [
    query('start').isISO8601().withMessage('Start date is required and must be a valid date'),
    query('end').isISO8601().withMessage('End date is required and must be a valid date'),
    validateRequest
  ],
  authorize(['admin', 'staff']),
  bookingController.getCalendarBookings
);

// Check studio availability
router.get(
  '/availability',
  [
    query('studioId').isUUID(4).withMessage('Studio ID is required'),
    query('date').isISO8601().withMessage('Date is required and must be a valid date'),
    validateRequest
  ],
  bookingController.checkAvailability
);

module.exports = router;