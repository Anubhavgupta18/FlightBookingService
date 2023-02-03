const { bookingRepository } = require('../repository/index');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const { StatusCodes } = require('http-status-codes');
const axios = require('axios');
const AppError = require('../utils/errors/app-error');
const { ServiceError } = require('../utils/errors');

class bookingService{
    constructor() {
        this.BookingRepository = new bookingRepository();
    }
    async createBooking(data) {
        try {
            const flightId = data.flightId;
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const flight = await axios.get(getFlightRequestURL);
            const flightObject = flight.data.data;

            if (data.noOfSeats > flightObject.totalSeats) {
                throw new ServiceError('Something went wrong in the booking process', 'Insufficient Seats');
            }

            const totalCost = flightObject.price * data.noOfSeats;
            const bookingPayload = { ...data, totalCost };
            const booking = await this.BookingRepository.create(bookingPayload);
            
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            await axios.patch(updateFlightRequestURL, { totalSeats: flightObject.totalSeats - booking.noOfSeats });

            const updatedbooking = await this.BookingRepository.update(booking.id, { status: 'Booked' });
            return updatedbooking;
        } catch (error) {
            if (error.name == 'ValidationError'||error.name=='RepositoryError')
            {
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = bookingService;