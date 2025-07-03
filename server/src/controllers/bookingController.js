const { Booking, User, Studio, Equipment } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/emailService');

// Get all bookings with pagination
exports.getBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Filter options
    const filters = {};
    
    if (req.query.status) {
      filters.status = req.query.status;
    }
    
    if (req.query.clientId) {
      filters.clientId = req.query.clientId;
    }
    
    if (req.query.engineerId) {
      filters.engineerId = req.query.engineerId;
    }
    
    if (req.query.studioId) {
      filters.studioId = req.query.studioId;
    }
    
    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filters.startTime = {
        [Op.between]: [new Date(req.query.startDate), new Date(req.query.endDate)]
      };
    }
    
    const { count, rows } = await Booking.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['startTime', 'ASC']],
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'engineer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Studio,
          as: 'studio',
          attributes: ['id', 'name', 'hourlyRate']
        },
        {
          model: Equipment,
          as: 'equipment',
          attributes: ['id', 'name', 'category'],
          through: { attributes: [] }
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      bookings: rows
    });
  } catch (error) {
    next(error);
  }
};

// Get booking by ID
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        },
        {
          model: User,
          as: 'engineer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        },
        {
          model: Studio,
          as: 'studio',
          attributes: ['id', 'name', 'description', 'hourlyRate']
        },
        {
          model: Equipment,
          as: 'equipment',
          attributes: ['id', 'name', 'category', 'description'],
          through: { attributes: [] }
        }
      ]
    });
    
    if (!booking) {
      return next(new ApiError('Booking not found', 404));
    }
    
    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// Create new booking
exports.createBooking = async (req, res, next) => {
  try {
    const {
      studioId,
      clientId,
      engineerId,
      startTime,
      endTime,
      notes,
      equipmentIds
    } = req.body;
    
    // Validate studio exists
    const studio = await Studio.findByPk(studioId);
    if (!studio) {
      return next(new ApiError('Studio not found', 404));
    }
    
    // Validate client exists
    const client = await User.findOne({
      where: { id: clientId, userType: 'client' }
    });
    if (!client) {
      return next(new ApiError('Client not found', 404));
    }
    
    // Validate engineer exists if provided
    if (engineerId) {
      const engineer = await User.findOne({
        where: { id: engineerId, userType: 'staff' }
      });
      if (!engineer) {
        return next(new ApiError('Engineer not found', 404));
      }
    }
    
    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      where: {
        studioId,
        status: { [Op.notIn]: ['cancelled'] },
        [Op.or]: [
          {
            startTime: { [Op.lt]: new Date(endTime) },
            endTime: { [Op.gt]: new Date(startTime) }
          }
        ]
      }
    });
    
    if (conflictingBooking) {
      return next(new ApiError('There is a conflicting booking for this time slot', 400));
    }
    
    // Calculate total price based on studio hourly rate and duration
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    const durationHours = (endTimeDate - startTimeDate) / (1000 * 60 * 60);
    const totalPrice = studio.hourlyRate * durationHours;
    
    // Create booking
    const booking = await Booking.create({
      studioId,
      clientId,
      engineerId,
      startTime: startTimeDate,
      endTime: endTimeDate,
      notes,
      totalPrice,
      status: 'pending'
    });
    
    // Add equipment if provided
    if (equipmentIds && equipmentIds.length > 0) {
      await booking.setEquipment(equipmentIds);
    }
    
    // Send confirmation email to client
    await sendEmail({
      to: client.email,
      subject: 'Booking Confirmation - Studio Booking Assistant',
      template: 'booking-confirmation',
      data: {
        clientName: `${client.firstName} ${client.lastName}`,
        studioName: studio.name,
        startTime: startTimeDate.toLocaleString(),
        endTime: endTimeDate.toLocaleString(),
        bookingId: booking.id
      }
    });
    
    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// Update booking
exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return next(new ApiError('Booking not found', 404));
    }
    
    // Check if booking is already completed or cancelled
    if (['completed', 'cancelled'].includes(booking.status)) {
      return next(new ApiError(`Cannot update a ${booking.status} booking`, 400));
    }
    
    const {
      studioId,
      engineerId,
      startTime,
      endTime,
      notes,
      status,
      equipmentIds
    } = req.body;
    
    // If time is being updated, check for conflicts
    if (startTime || endTime) {
      const newStartTime = startTime ? new Date(startTime) : booking.startTime;
      const newEndTime = endTime ? new Date(endTime) : booking.endTime;
      
      const conflictingBooking = await Booking.findOne({
        where: {
          id: { [Op.ne]: booking.id },
          studioId: studioId || booking.studioId,
          status: { [Op.notIn]: ['cancelled'] },
          [Op.or]: [
            {
              startTime: { [Op.lt]: newEndTime },
              endTime: { [Op.gt]: newStartTime }
            }
          ]
        }
      });
      
      if (conflictingBooking) {
        return next(new ApiError('There is a conflicting booking for this time slot', 400));
      }
      
      // Recalculate price if time changes
      if (startTime || endTime) {
        const studio = await Studio.findByPk(studioId || booking.studioId);
        const durationHours = (newEndTime - newStartTime) / (1000 * 60 * 60);
        booking.totalPrice = studio.hourlyRate * durationHours;
      }
    }
    
    // Update booking fields
    await booking.update({
      studioId: studioId || booking.studioId,
      engineerId: engineerId !== undefined ? engineerId : booking.engineerId,
      startTime: startTime ? new Date(startTime) : booking.startTime,
      endTime: endTime ? new Date(endTime) : booking.endTime,
      notes: notes !== undefined ? notes : booking.notes,
      status: status || booking.status
    });
    
    // Update equipment if provided
    if (equipmentIds) {
      await booking.setEquipment(equipmentIds);
    }
    
    // Get updated booking with associations
    const updatedBooking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'engineer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Studio,
          as: 'studio',
          attributes: ['id', 'name', 'hourlyRate']
        },
        {
          model: Equipment,
          as: 'equipment',
          attributes: ['id', 'name', 'category'],
          through: { attributes: [] }
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      booking: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return next(new ApiError('Booking not found', 404));
    }
    
    // Check if booking is already completed or cancelled
    if (['completed', 'cancelled'].includes(booking.status)) {
      return next(new ApiError(`Cannot cancel a ${booking.status} booking`, 400));
    }
    
    const { cancelledReason } = req.body;
    
    await booking.update({
      status: 'cancelled',
      cancelledReason: cancelledReason || 'Cancelled by user'
    });
    
    // Notify client about cancellation
    const client = await User.findByPk(booking.clientId);
    await sendEmail({
      to: client.email,
      subject: 'Booking Cancellation - Studio Booking Assistant',
      template: 'booking-cancellation',
      data: {
        clientName: `${client.firstName} ${client.lastName}`,
        bookingId: booking.id,
        startTime: booking.startTime.toLocaleString(),
        reason: cancelledReason || 'Cancelled by user'
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// Get bookings for calendar view
exports.getCalendarBookings = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return next(new ApiError('Start and end dates are required', 400));
    }
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const bookings = await Booking.findAll({
      where: {
        [Op.or]: [
          {
            startTime: { [Op.between]: [startDate, endDate] }
          },
          {
            endTime: { [Op.between]: [startDate, endDate] }
          },
          {
            [Op.and]: [
              { startTime: { [Op.lte]: startDate } },
              { endTime: { [Op.gte]: endDate } }
            ]
          }
        ],
        status: { [Op.ne]: 'cancelled' }
      },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Studio,
          as: 'studio',
          attributes: ['id', 'name']
        }
      ]
    });
    
    // Format for calendar view
    const calendarEvents = bookings.map(booking => ({
      id: booking.id,
      title: `${booking.studio.name} - ${booking.client.firstName} ${booking.client.lastName}`,
      start: booking.startTime,
      end: booking.endTime,
      resourceId: booking.studioId,
      status: booking.status,
      extendedProps: {
        clientId: booking.clientId,
        engineerId: booking.engineerId,
        notes: booking.notes
      }
    }));
    
    res.status(200).json({
      success: true,
      events: calendarEvents
    });
  } catch (error) {
    next(error);
  }
};

// Check studio availability
exports.checkAvailability = async (req, res, next) => {
  try {
    const { studioId, date } = req.query;
    
    if (!studioId || !date) {
      return next(new ApiError('Studio ID and date are required', 400));
    }
    
    // Set time range for the entire day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Get all bookings for the studio on that day
    const bookings = await Booking.findAll({
      where: {
        studioId,
        status: { [Op.notIn]: ['cancelled'] },
        [Op.or]: [
          {
            startTime: { [Op.between]: [startOfDay, endOfDay] }
          },
          {
            endTime: { [Op.between]: [startOfDay, endOfDay] }
          },
          {
            [Op.and]: [
              { startTime: { [Op.lte]: startOfDay } },
              { endTime: { [Op.gte]: endOfDay } }
            ]
          }
        ]
      },
      attributes: ['id', 'startTime', 'endTime', 'status'],
      order: [['startTime', 'ASC']]
    });
    
    // Get studio opening hours (simplified for this example)
    const openingHour = 9; // 9 AM
    const closingHour = 22; // 10 PM
    
    // Generate availability slots (hourly)
    const availabilitySlots = [];
    const bookedSlots = [];
    
    for (let hour = openingHour; hour < closingHour; hour++) {
      const slotStart = new Date(startOfDay);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(startOfDay);
      slotEnd.setHours(hour + 1, 0, 0, 0);
      
      // Check if slot overlaps with any booking
      const isBooked = bookings.some(booking => {
        return (
          (booking.startTime < slotEnd && booking.endTime > slotStart)
        );
      });
      
      if (isBooked) {
        bookedSlots.push({
          start: slotStart,
          end: slotEnd
        });
      } else {
        availabilitySlots.push({
          start: slotStart,
          end: slotEnd
        });
      }
    }
    
    res.status(200).json({
      success: true,
      date: startOfDay,
      studioId,
      availableSlots: availabilitySlots,
      bookedSlots,
      openingHour,
      closingHour
    });
  } catch (error) {
    next(error);
  }
};