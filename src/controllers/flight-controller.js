const { StatusCodes } = require('http-status-codes');
const { bookingService } = require('../services/index');
const BookingService = new bookingService();
const create = async (req, res) => {
    try {
        const response = await BookingService.createBooking(req.body);
        return res.status(StatusCodes.OK).json({
            data: response,
            success: true,
            message: 'Successfully created a booking',
            err: {}
        });
    } catch (error) {
        return res.status(error.statusCode).json({
            data: {},
            success: false,
            message: error.message,
            explanation:error.explanation
        })
    }
}

module.exports = {
    create
}