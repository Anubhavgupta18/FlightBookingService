const { bookingRepository } = require('../repository/index');
const { FLIGHT_SERVICE_PATH, REMINDER_BINDING_KEY,AUTH_SERVICE_PATH } = require('../config/serverConfig');
const { StatusCodes } = require('http-status-codes');
const axios = require('axios');
const AppError = require('../utils/errors/app-error');
const { ServiceError } = require('../utils/errors');
const { createChannel,publishMessage } = require('../utils/messageQueues/messageQueue');

class bookingService{
    constructor() {
        this.BookingRepository = new bookingRepository();
    }
    async createBooking(Data) {
        try {
            const flightId = Data.flightId;
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const flight = await axios.get(getFlightRequestURL);
            const flightObject = flight.data.data;

            if (Data.noOfSeats > flightObject.totalSeats) {
                throw new ServiceError('Something went wrong in the booking process', 'Insufficient Seats');
            }

            const totalCost = flightObject.price * Data.noOfSeats;
            const bookingPayload = { ...Data, totalCost };
            const booking = await this.BookingRepository.create(bookingPayload);
            
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            await axios.patch(updateFlightRequestURL, { totalSeats: flightObject.totalSeats - booking.noOfSeats });

            const updatedbooking = await this.BookingRepository.update(booking.id, { status: 'Booked' });

            // const getUserRequestURL = `${AUTH_SERVICE_PATH}/api/v1//${data.userId}`
            // const user = await axios.get(getUserRequestURL);
            const channel = await createChannel();
            const payload = {
                data: {
                    subject: 'Flight Booked',
                    content:'Dear user, Thanks for booking flight from Sample Airlines. Your 2nd Flight is booked',
                    recepientEmail: 'anubhavshivahre@gmail.com',
                    notificationTime :updatedbooking.updatedAt
                },
                service: ['CREATE_TICKET','SEND_MAIL']
            };
            await publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));


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