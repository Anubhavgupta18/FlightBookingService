const { StatusCodes } = require('http-status-codes');
const { booking } = require('../models/index');
const { ValidationError, AppError } = require('../utils/errors/index');

class bookingRepository{
    async create(data) {
        try {
            const Booking = await booking.create(data);
            return Booking;
        } catch (error) {
            if (error.name = 'SequelizeValidationError')
            {
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError',
                'Cannot create Booking',
                'There was some issue creating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    async update (bookingId, data) {
        try {
            const Booking = await booking.findByPk(bookingId);
            if (data.status) {
                Booking.status = data.status;
            }
            Booking.save();
            return Booking;
        } catch (error) {
            if (error.name = 'SequelizeValidationError')
            {
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError',
                'Cannot update Booking',
                'There was some issue updating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}

module.exports = bookingRepository;