const express = require('express');
const router = express.Router();
const flightController = require('../../controllers/flight-controller')

const FlightController = new flightController();

router.post('/booking', FlightController.create);
router.post('/publish', FlightController.sendMessageToQueue);

module.exports = router;