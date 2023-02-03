const express = require('express');
const router = express.Router();
const flightController = require('../../controllers/flight-controller')

router.post('/booking', flightController.create);

module.exports = router;